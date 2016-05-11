Meteor.methods({
  'mautic.account' () {
    var user = Meteor.users.findOne(Meteor.userId);
    return user ? user.services.mautic : [];
  },
  'mautic.leads' (callback) {
    this.unblock();
    Mautic.refreshAccessToken();
    var response;
    try {
      var baseUrl = Meteor.settings.public.mautic.baseUrl + '/api/leads';
      var account = Meteor.call('mautic.account');
      response = Meteor.http.get(baseUrl, {
        params: {
          access_token: account.accessToken
        }
      });
    } catch (err) {
      throw _.extend(new Error("Failed to load Mautic leads. " + err.message), {
        response: err.response
      });
    }

    if (!isJSON(response.content)) {
      throw new Error("Failed to load Mautic leads. ", response.content);
    }

    if (typeof callback === 'function') {
      callback(response.content);
    } else {
      return response.content;
    }
  }
});
