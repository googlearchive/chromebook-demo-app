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

StoreApp.prototype.applyLocale = function(lang) {
  App.prototype.applyLocale.call(this, lang);
  var disableAppList = Locale.get(lang, 'STORE_DISABLE_APP_LIST').split(' ');
  var tiles = this.document.querySelectorAll('.app');
  for (var i = 0; i < tiles.length; i++) {
    var appID = tiles[i].className.replace('app', '')
                                  .replace('disable', '')
                                  .replace(/\s+/g, '');
    tiles[i].classList.toggle('disable', disableAppList.indexOf(appID) != -1);
  }
};

new StoreApp().start();
