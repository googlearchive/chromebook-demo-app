var GameApp = function() {
  App.call(this, GAME_WINDOW_ID, 'game-app.html', false);
};

GameApp.prototype = {
  __proto__: App.prototype
};

GameApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);
};

new GameApp().start();
