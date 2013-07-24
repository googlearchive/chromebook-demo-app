var MusicApp = function() {
  App.call(this, MUSIC_WINDOW_ID, 'music-app.html', false);
};

MusicApp.prototype = {
  __proto__: App.prototype
};

MusicApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new MusicApp().start();
