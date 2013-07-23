var PlayApp = function() {
  App.call(this, PLAY_WINDOW_ID, 'play-app.html', false);
};

PlayApp.prototype = {
  __proto__: App.prototype
};

PlayApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new PlayApp().start();
