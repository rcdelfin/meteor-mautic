// Request Mautic credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Mautic.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'mautic'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('mautic', config, options);

  var scope = [];
  if (options && options.requestPermissions) {
      scope = options.requestPermissions.join('+');
  }

  var loginStyle = OAuth._loginStyle('mautic', config, options);

  if(Meteor.settings && Meteor.settings.public !== undefined && Meteor.settings.public.mautic !== undefined && Meteor.settings.public.mautic.baseUrl !== undefined) {

    var baseUrl = Meteor.settings.public.mautic.baseUrl;
    var loginUrl = baseUrl + '/oauth/v2/authorize' +
          '?client_id=' + config.clientId +
          '&grant_type=authorization_code' +
          '&redirect_uri=' + OAuth._redirectUri('mautic', config) +
          '&response_type=code' +
          '&state=' + OAuth._stateParam(loginStyle, credentialToken);

    OAuth.launchLogin({
      loginService: "mautic",
      loginStyle: loginStyle,
      loginUrl: loginUrl,
      credentialRequestCompleteCallback: credentialRequestCompleteCallback,
      credentialToken: credentialToken
    });
  } else {
      console.log("public.mautic.baseUrl has not been set in your settings.json file.")
  }
};
