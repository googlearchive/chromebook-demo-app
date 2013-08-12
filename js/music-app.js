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

  // Apply the variation.
  var variation = Component.ENTRIES.Music.variation;
  this.mainMusic_.classList.add(variation);
  this.mainMusic_.querySelector('.song-name').innerText =
      chrome.i18n.getMessage(
          'MUSIC_' + variation.toUpperCase() + '_SONG_NAME');
  this.mainMusic_.querySelector('.artist-name').innerText =
      chrome.i18n.getMessage(
          'MUSIC_' + variation.toUpperCase() + '_ARTIST_NAME');
  this.mainMusic_.querySelector('.music-footer').innerText =
      chrome.i18n.getMessage(
          'MUSIC_' + variation.toUpperCase() + '_FOOTER_MESSAGE');
  this.mainMusicAudio_.src = 'music-' + variation + '.mp3';

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

MusicApp.prototype.updateView_ = function() {
  if (this.mainMusicAudio_.paused)
    this.mainMusic_.classList.remove('play');
  else
    this.mainMusic_.classList.add('play');
};

new MusicApp().start();
