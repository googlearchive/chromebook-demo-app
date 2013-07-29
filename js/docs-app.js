var DocsApp = function() {
  App.call(this, DOCS_WINDOW_ID, 'docs-app.html', false);
};

DocsApp.prototype = {
  __proto__: App.prototype
};

DocsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Set padding as the smae size of scroll width.
  var paperContainer = this.get('.paper-container');
  var scrollSize =
      this.get('#docs-main').clientWidth -
      paperContainer.clientWidth;
  paperContainer.style.paddingLeft = scrollSize + 'px';
};

new DocsApp().start();
