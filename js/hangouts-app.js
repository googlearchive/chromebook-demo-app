var HangoutsApp = function() {
  App.call(this, HANGOUTS_WINDOW_ID, 'hangouts-app.html', false);
  this.videoInitialized_ = false;
  this.effectIndex_ = 0;
  this.frame_ = 0;
  this.renderFrameBound_ = this.renderFrame_.bind(this);
  this.frequency_ = 8;
  this.effects_ = new Effects();
  this.effects_.init();
  Effects.defineAdditionalEffects(this.effects_);
  this.tracker_ = new FaceTracker(ccv);
  this.tracker_.init(0, 0, 0, 0);
};

HangoutsApp.prototype = {
  __proto__: App.prototype
};

HangoutsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Init camera.
  navigator.webkitGetUserMedia(
    {video: {mandatory: {maxWidth: 640, maxHeight: 360}}},
    function(localMediaStream) {
      if (this.videoInitialized_)
        return;

      // Register the events.
      this.get('.effects.button').addEventListener('click', function() {
        var nextEffextIndex;
        do {
          nextEffextIndex = ~~(Math.random() * this.effects_.data.length);
        } while (nextEffextIndex == this.effectsIndex_);
        this.effectIndex_ = nextEffextIndex;
      }.bind(this));

      // Initialize the video.
      var URL = this.window.URL;
      var url = URL.createObjectURL(localMediaStream);
      var videoSource = this.get('.video-source');
      videoSource.src = url;
      videoSource.play();
      this.videoSource_ = videoSource;
      this.mediaStream_ = localMediaStream;
      this.canvas_ = this.get('.video-canvas');
      this.canvasContext_ = this.canvas_.getContext('2d');
      this.effectIndex_ = 0;
      this.frame_ = 0;
      this.track_ = {faces:[]};
      this.videoInitialized_ = true;
      this.renderFrame_();
    }.bind(this),

    function(err) {
      // Nothing to do when it failed.
      console.error('Failed to initialize the camera.');
    }
  );
};

HangoutsApp.prototype.renderFrame_ = function() {
  if (!this.videoInitialized_)
    return;
  this.canvasContext_.drawImage(
      this.videoSource_, 0, 0, this.canvas_.width, this.canvas_.height);
  var effect = this.effects_.data[this.effectIndex_];
  if (effect.tracks && this.frame_ % this.frequency_ == 0)
    this.track_ = this.tracker_.track(this.canvas_);
  this.effects_.advance(this.canvas_);
  effect.filter(this.canvas_, this.canvas_, this.frame_++, this.track_);
  this.window.requestAnimationFrame(this.renderFrameBound_);
};

HangoutsApp.prototype.close = function() {
  if (this.videoInitialized_) {
    this.videoSource_.pause();
    this.mediaStream_.stop();
    this.videoInitialized_ = false;
  }
  App.prototype.close.call(this);
};

new HangoutsApp().start();
