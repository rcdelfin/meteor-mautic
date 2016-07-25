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
      throw _.extend(new Error("Failed to load Mautic content(s). " + err.message), {
        response: err.response
      });
    }

    if (!isJSON(response)) {
      throw new Error("Failed to load Mautic leads. ", response);
    }

    if (!callback && typeof params === 'function') {
      callback = params;
      return callback(response);
    }

    return response;
  }
});
