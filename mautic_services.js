Meteor.methods({
  'mautic.account' () {
    var user = Meteor.users.findOne(Meteor.userId);
    return user ? user.services.mautic : [];
  },
  'mautic/get' (endpoint, params, callback) {
    Mautic.refreshAccessToken();
    var response;
    try {
      var baseUrl = Meteor.settings.public.mautic.baseUrl + '/api' + endpoint;
      var account = Meteor.call('mautic.account');
      if (!account) {
        response = {};
        return;
      }
      var payload = {
        params: {
          access_token: account.accessToken
        }
      };
      if (typeof params === 'object') {
        payload = _.extend(payload, params);
      }
      response = HTTP.get(baseUrl, payload).content;
    } catch (err) {
      throw _.extend(new Error("Failed to load Mautic leads. " + err.message), {
        response: err.response
      });
    }

    if (!isJSON(response)) {
      throw new Error("Failed to load Mautic leads. ", response);
    }

    var fn = (typeof params === 'function') ? params : callback;
    if (typeof fn === 'function') {
      fn(response);
    } else {
      return response;
    }
  }
});
