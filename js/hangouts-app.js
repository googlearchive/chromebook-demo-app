var HangoutsApp = function() {
  App.call(this);
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

HangoutsApp.EFFECT_BUTTON_WAITING_SECONDS = 5;

HangoutsApp.prototype = {
  __proto__: App.prototype
};

HangoutsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Get elements.
  this.canvas_ = this.get('.video-canvas');
  this.canvasContext_ = this.canvas_.getContext('2d');
  this.videoSource_ = this.get('.video-source');

  // Reset variables.
  var effects = this.effects_.data;
  this.effectIndex_ = 0;
  this.frame_ = 0;
  this.track_ = {faces:[]};
  for (var i = 0; i < effects.length; i++) {
    effects[i].index = i;
    effects[i].count = 0;
  }
  effects[effects.length - 1].count = -1;

  // Effect button.
  this.effectButton_ = this.get('.effects.button');
  this.effectButton_.addEventListener('click', function() {
    var counts = [];
    for (var i = 0; i < effects.length; i++) {
      var effect = effects[i];
      if (!counts[effect.count])
        counts[effect.count] = [];
      counts[effect.count].push(effects[i]);
    }
    for (var i = -1; i < effects.length; i++) {
      if (!counts[i])
        continue;
      var target = counts[i][~~(Math.random() * counts[i].length)];
      target.count++;
      this.effectIndex_ = target.index;
      break;
    }
  }.bind(this));

  this.effectButton_.addEventListener('mouseover', function() {
    this.timeCounter_ = 0;
    this.updateEffectButtonFocus_();
  }.bind(this));

  this.effectButton_.addEventListener('mouseout', function() {
    this.timeCounter_ = HangoutsApp.EFFECT_BUTTON_WAITING_SECONDS;
    this.updateEffectButtonFocus_();
  }.bind(this));

  this.timeCounter_ = HangoutsApp.EFFECT_BUTTON_WAITING_SECONDS;
  if (!('intervalID_' in this)) {
    this.intervalID_ = setInterval(function() {
      this.timeCounter_--;
      this.updateEffectButtonFocus_();
    }.bind(this), 1000);
  }

  // Licence page.
  this.get('.licence.context-menu-item').addEventListener('click', function() {
    Component.ENTRIES.Helper.sendMessage({name: 'showLicencePage'});
  });

  // Init camera.
  navigator.webkitGetUserMedia(
    {video: {mandatory: {maxWidth: 640, maxHeight: 360}}},
    function(localMediaStream) {
      if (this.videoInitialized_)
        return;

      // Initialize the video.
      this.videoSource_.src =
          this.window.URL.createObjectURL(localMediaStream);
      this.videoSource_.play();
      this.mediaStream_ = localMediaStream;
      this.videoInitialized_ = true;
      this.renderFrame_();
    }.bind(this),

    function(err) {
      // Nothing to do when it failed.
      console.error('Failed to initialize the camera.');
    }
  );
};

HangoutsApp.prototype.updateEffectButtonFocus_ = function() {
  this.effectButton_.classList.toggle('waiting', this.timeCounter_ <= 0);
};

HangoutsApp.prototype.renderFrame_ = function() {
  if (!this.videoInitialized_)
    return;
  this.canvasContext_.save();
  this.canvasContext_.scale(-1, 1);
  this.canvasContext_.translate(-this.canvas_.width, 0);
  this.canvasContext_.drawImage(
      this.videoSource_, 0, 0, this.canvas_.width, this.canvas_.height);
  this.canvasContext_.restore();

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
  if ('intervalID_' in this) {
    clearInterval(this.intervalID_);
    delete this.intervalID_;
  }
  App.prototype.close.call(this);
};

new HangoutsApp().start();
