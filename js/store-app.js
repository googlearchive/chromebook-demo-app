var StoreApp = function() {
  App.call(this);
};

StoreApp.prototype = {
  __proto__: App.prototype
};

StoreApp.prototype.initDocument = function() {
  var moreAppsButton = this.get('#more-apps-button');

  // Padding bottom which should be the same value with the padding top and
  // the get more app button's height.
  var additonalSpace =
      parseInt(getComputedStyle(this.get('.app-side-body')).paddingTop) +
      moreAppsButton.getBoundingClientRect().height;
  console.log(additonalSpace);
  App.prototype.initDocument.call(this, additonalSpace);

  // App tiles.
  var apps = this.document.querySelectorAll('.app');
  for (var i = 0; i < apps.length; i++) {
    apps[i].addEventListener('click', function(app) {
      var id = app.getAttribute('data-id');
      Component.ENTRIES.Helper.sendMessage({name: 'launch', id: id});
    }.bind(this, apps[i]));
    apps[i].addEventListener('mousedown', function(app, event) {
      event.preventDefault();
    }.bind(this, apps[i]));
    apps[i].addEventListener('keydown', function(app, event) {
      if (event.keyCode == 13 || event.keyCode == 32) {
        var id = app.getAttribute('data-id');
        Component.ENTRIES.Helper.sendMessage({name: 'launch', id: id});
        event.preventDefault();
      }
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
