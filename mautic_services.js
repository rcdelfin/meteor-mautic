Meteor.methods({
  'mautic.account' () {
    var user = Meteor.users.findOne(Meteor.userId);
    return user ? user.services.mautic : [];
  },
  'mautic/api' (endpoint, params, callback) {
    Mautic.refreshAccessToken();
    var response;
    try {
      this.unblock();

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
      var httpMethod = 'GET';
      if (typeof params === 'object') {
        payload = _.extend(payload, params);
        if (!_.isUndefined(params.method)) {
          httpMethod = params.method;
          delete params.method;
        }
      }
      response = HTTP.call(httpMethod, baseUrl, payload).content;
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
