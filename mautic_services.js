Meteor.methods({
  'mautic/api' (endpoint, params, callback) {
    var response;
    var paramsCopy = _.clone(params);
    try {
      this.unblock();

      var baseUrl = Meteor.settings.public.mautic.baseUrl;
      if (!_.isUndefined(params.baseUrl)) {
        baseUrl = params.baseUrl;
        delete params.baseUrl;
        delete params.clientId;
        delete params.secret;
      }

      var mauticUrl = baseUrl + '/api' + endpoint;
      var account = Meteor.user().services.mautic;
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
        if (!_.isUndefined(params.method)) {
          httpMethod = params.method;
          delete params.method;
        }
        if (!_.isEmpty(params.data)) {
          if (!_.isUndefined(params.data.ip)) {
            params.data.ip = this.connection.clientAddress;
          }
        }
      }
      payload = _.extend(payload, params);
      response = HTTP.call(httpMethod, mauticUrl, payload).content;
    } catch (err) {
      var options = {};
      if (!_.isUndefined(paramsCopy.baseUrl)) {
        options = {
          baseUrl: paramsCopy.baseUrl,
          clientId: paramsCopy.clientId,
          secret: paramsCopy.secret
        }
      }
      Mautic.refreshAccessToken(options);

      throw _.extend(new Error("Failed to load Mautic content(s). " + err.message), {
        response: err.response
      });
    }

    if (!isJSON(response)) {
      throw new Error("Failed to load Mautic leads. ", response);
    }

    if (!callback && typeof params === 'function') {
      callback = params;
      return callback(JSON.parse(response));
    }

    return JSON.parse(response);
  }
});
