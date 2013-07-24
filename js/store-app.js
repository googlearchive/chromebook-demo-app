var StoreApp = function() {
  App.call(this, Store_WINDOW_ID, 'store-app.html', false);
};

StoreApp.prototype = {
  __proto__: App.prototype
};

StoreApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new StoreApp().start();
