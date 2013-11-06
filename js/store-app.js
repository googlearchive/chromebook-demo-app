var StoreApp = function() {
  App.call(this);
  this.lang_ = 'en';
  this.apps_ = [];
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
      (moreAppsButton.getBoundingClientRect().height || 47);
  App.prototype.initDocument.call(this, additonalSpace);

  // App tiles.
  Component.ENTRIES.Helper.sendMessage({name: 'getPackApps'}, function(apps) {
    this.apps_ = chrome.runtime.lastError ? Component.PACKS.slice() : apps;
    this.updateApps();
  }.bind(this));

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

  // More apps button.
  moreAppsButton.addEventListener('click', function() {
    Component.ENTRIES.Helper.sendMessage({name: 'visitStore'});
  }.bind(this));
};

StoreApp.prototype.applyLocale = function(lang) {
  App.prototype.applyLocale.call(this, lang);
  this.lang_ = lang;
  this.updateApps();
};

StoreApp.prototype.updateApps = function() {
  var disableAppList = Locale.get(
      this.lang_, 'STORE_DISABLE_APP_LIST').split(' ');
  var tiles = this.document.querySelectorAll('.app');
  for (var i = 0; i < tiles.length; i++) {
    var appID = tiles[i].className.replace('app', '')
                                  .replace('disable', '')
                                  .replace(/\s+/g, '');
    tiles[i].classList.toggle(
        'active',
        this.apps_.indexOf(tiles[i].getAttribute('data-id')) != -1 &&
        disableAppList.indexOf(appID) == -1);
  }
};

new StoreApp().start();
