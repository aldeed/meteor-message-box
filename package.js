Package.describe({
  name: "aldeed:message-box",
  summary: "Reactive validation error messages",
  version: "0.0.1",
  git: "https://github.com/aldeed/meteor-message-box.git"
});

Npm.depends({
  'handlebars': '4.0.5',
  'deep-extend': '0.4.1',
});

Package.onUse(function(api) {
  api.use([
    'reactive-var@1.0.0',
    'ecmascript',
    'underscore',
  ]);

  api.addFiles([
    'main.js',
  ]);

  api.export([
    'MessageBox',
  ]);
});

// Package.onTest(function(api) {
//   api.use([
//     'ecmascript',
//     'aldeed:message-box',
//   ]);

//   api.addFiles([

//   ]);
// });
