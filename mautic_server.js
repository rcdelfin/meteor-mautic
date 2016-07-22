var OAuth = Package.oauth.OAuth;

OAuth.registerService('mautic', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var refreshToken = response.refreshToken;
  var identity =  {
    id: Random.id(),
    name: 'mautic'
  };
  var userData = getIdentity(accessToken);
  identity = _.extend(identity, {
    id: userData.id,
    name: userData.firstName + ' ' + userData.lastName,
    email: userData.email
  });

  var id = identity.id;
  if (!id) {
    throw new Error("Mautic did not provide an id");
  }
  var serviceData = {
    id: id,
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    refreshToken: refreshToken
  };
  return {
    serviceData: serviceData,
    options: {
      profile: identity
    }
  };
});


// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'mautic'});
  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  var responseContent;
  try {
    if(Meteor.settings && Meteor.settings.public !== undefined && Meteor.settings.public.mautic !== undefined && Meteor.settings.public.mautic.baseUrl !== undefined) {

      var baseUrl = Meteor.settings.public.mautic.baseUrl;
      //Request an access token
      responseContent = Meteor.http.post(
        baseUrl + "/oauth/v2/token", {params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('mautic', config),
          grant_type: 'authorization_code'
        }}).content;
    } else {
      console.log("public.mautic.baseUrl has not been set in your settings.json file.")
    }
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with Mautic. " + err.message);
  }

  // If 'responseContent' does not parse as JSON, it is an error.
  if (!isJSON(responseContent)) {
    throw new Error("Failed to complete OAuth handshake with Mautic. " + responseContent);
  }

  // Success! Extract access token and expiration
  var parsedResponse = JSON.parse(responseContent);
  var accessToken = parsedResponse.access_token;
  var expiresIn = parsedResponse.expires_in;
  var refreshToken = parsedResponse.refresh_token;

  if (!accessToken) {
    throw new Error("Failed to complete OAuth handshake with Mautic " +
      "-- can't find access token in HTTP response. " + responseContent);
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn,
    refreshToken: refreshToken
  };
};

var getIdentity = function (accessToken) {
  var responseContent;
  try {
    var baseUrl = Meteor.settings.public.mautic.baseUrl + '/api/users/self';
    var payload = {
      params: {
        access_token: accessToken
      }
    };
    responseContent = HTTP.get(baseUrl, payload).data;
  } catch (err) {
    throw new Error("Failed to complete OAuth logged account. " + err.message);
  }
  return responseContent;
};

Mautic.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
