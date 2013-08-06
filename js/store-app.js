var StoreApp = function() {
  App.call(this);
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
      Component.ENTRIES.Helper.sendMessage({name: 'launch', id: id});
    }.bind(this, apps[i]));
  }
};

new StoreApp().start();
