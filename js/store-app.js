var StoreApp = function() {
  App.call(this, STORE_WINDOW_ID, 'store-app.html');
};

StoreApp.prototype = {
  __proto__: App.prototype
};

StoreApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // App tiles.
  var apps = this.document.querySelectorAll('.app');
  for (var i = 0; i < apps.length; i++) {
    apps[i].addEventListener('click', function(app) {
      var id = app.getAttribute('data-id');
      console.log(id);
      chrome.runtime.sendMessage(HELPER_EXTENSION_ID, {name: 'launch', id: id});
    }.bind(this, apps[i]));
  }
};

new StoreApp().start();
