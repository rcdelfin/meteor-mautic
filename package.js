Package.describe({
  name: "rcdelfin:mautic",
  summary: "A OAuth2 wrapper for the Mautic API",
  version: "0.0.1",
  git: "https://github.com/rcdelfin/mautic.git"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Mautic');

  api.addFiles(['mautic_configure.html', 'mautic_configure.js'], 'client');
  api.addFiles('mautic_common.js', ['client', 'server']);
  api.addFiles('mautic_server.js', 'server');
  api.addFiles('mautic_client.js', 'client');
});