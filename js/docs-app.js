var DocsApp = function() {
  App.call(this, DOCS_WINDOW_ID, 'docs-app.html', false);
};

DocsApp.prototype = {
  __proto__: App.prototype
};

DocsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new DocsApp().start();
