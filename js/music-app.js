var MusicApp = function() {
  App.call(this, MUSIC_WINDOW_ID, 'music-app.html', false);
};

MusicApp.prototype = {
  __proto__: App.prototype
};

MusicApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  this.mainMusic_ = this.get('.main.music');
  this.mainMusicAudio_ = this.get('.main-music-audio');

  this.get('.play-control').addEventListener('click', function() {
    if (this.mainMusicAudio_.paused)
      this.mainMusicAudio_.play();
    else
      this.mainMusicAudio_.pause();
    this.updateView_();
  }.bind(this));

  this.mainMusicAudio_.addEventListener('play', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('paused', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('ended', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('error', this.updateView_.bind(this));
};

MusicApp.prototype.updateView_ = function() {
  if (this.mainMusicAudio_.paused)
    this.mainMusic_.classList.remove('play');
  else
    this.mainMusic_.classList.add('play');
};

new MusicApp().start();
