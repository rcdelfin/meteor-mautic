Package.describe({
  name: "rcdelfin:mautic",
  summary: "A Oauth2 wrapper for the Mautic API",
  version: "0.0.5",
  git: "https://github.com/rcdelfin/mautic.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', ['client', 'server']);
  api.use('session', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('underscore', 'server');
  api.use('templating', 'client');

  api.addFiles(['mautic_configure.html', 'mautic_configure.js'], 'client');
  api.addFiles('mautic_common.js', ['client', 'server']);
  api.addFiles('mautic_oauth.js', ['client', 'server']);
  api.addFiles('mautic_server.js', 'server');
  api.addFiles('mautic_services.js', 'server');

  api.export('Mautic');
});
