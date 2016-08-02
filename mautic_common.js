if (typeof Mautic === 'undefined') {
  Mautic = {};
}

isJSON = function(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

hasServiceInUserProfile = function (service) {
  let services = Meteor.user().profile.services;
  if (_.isObject(services)) {
    let serviceKeys = _.keys(services);
    if (_.contains(serviceKeys, service)) {
      return services[service].connected;
    }
  }
  return false;
};
