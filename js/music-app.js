var MusicApp = function() {
  App.call(this);
};

MusicApp.prototype = {
  __proto__: App.prototype
};

MusicApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  this.mainMusic_ = this.get('.main.music');
  this.mainMusicAudio_ = this.get('.main-music-audio');

  // Play control button.
  this.get('.play-control').addEventListener('click', function() {
    if (this.mainMusicAudio_.paused)
      this.mainMusicAudio_.play();
    else
      this.mainMusicAudio_.pause();
    this.updateView_();
  }.bind(this));

  // Music event.
  this.mainMusicAudio_.addEventListener('play', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('paused', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('ended', this.updateView_.bind(this));
  this.mainMusicAudio_.addEventListener('error', this.updateView_.bind(this));
};

MusicApp.prototype.applyLocale = function(code) {
  App.prototype.applyLocale.call(this, code);

  // Stop the song.
  this.mainMusicAudio_.pause();
  this.updateView_();

  // Change the main song.
  var mainSong = Locale.get(code, 'MUSIC_MAIN_SONG');
  this.mainMusic_.classList.remove('lumineers');
  this.mainMusic_.classList.remove('war');
  this.mainMusic_.classList.remove('vivaldi');
  this.mainMusic_.classList.add(mainSong);
  this.mainMusic_.querySelector('.song-name').innerText =
      Locale.get(code, 'MUSIC_' + mainSong.toUpperCase() + '_SONG_NAME');
  this.mainMusic_.querySelector('.artist-name').innerText =
      Locale.get(code, 'MUSIC_' + mainSong.toUpperCase() + '_ARTIST_NAME');
  this.mainMusic_.querySelector('.music-footer').innerText =
      Locale.get(code, 'MUSIC_' + mainSong.toUpperCase() + '_FOOTER_MESSAGE');
  this.mainMusicAudio_.src = 'music-' + mainSong + '.mp3';
};

MusicApp.prototype.updateView_ = function() {
  if (this.mainMusicAudio_.paused)
    this.mainMusic_.classList.remove('play');
  else
    this.mainMusic_.classList.add('play');
};

new MusicApp().start();
