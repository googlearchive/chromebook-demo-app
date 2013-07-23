var HangoutsApp = function() {
  App.call(this, HANGOUTS_WINDOW_ID, 'hangouts-app.html', false);
};

HangoutsApp.prototype = {
  __proto__: App.prototype
};

HangoutsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new HangoutsApp().start();
