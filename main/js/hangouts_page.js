this.handlers = new HandlerList();

var Effects = defined.shift();
var FaceTracker = defined.shift();


chrome.runtime.onMessage.addListener(function(message, sender, response) {
  this.element_ = document.querySelector('#hangouts-app');
  this.effects_ = new Effects();
  if (message.name == 'enterHangoutsPage') {
    navigator.webkitGetUserMedia(
    {video: true},
    function(localMediaStream) {
      if (this.isVideoUsing)
        return;
      this.isVideoUsing = true;
      // Register the events.
      var doc = document;
      this.handlers.add(doc.querySelector('.prev-effect'), 'click', function() {
        this.effectIndex_ =
            (this.effectIndex_ + this.effects_.data.length - 1) %
            this.effects_.data.length;
      }.bind(this));
      this.handlers.add(doc.querySelector('.next-effect'), 'click', function() {
        this.effectIndex_ =
            (this.effectIndex_ + this.effects_.data.length + 1) %
            this.effects_.data.length;
      }.bind(this));
      // Initialize the video.
      var URL = window.URL;
      var url = URL.createObjectURL(localMediaStream);
      var videoSource = this.element_.querySelector('.video-source');
      videoSource.src = url;
      videoSource.play();
      this.videoSource_ = videoSource;
      this.mediaStream_ = localMediaStream;
      this.canvas_ = this.element_.querySelector('.video-canvas');
      this.canvasContext_ = this.canvas_.getContext('2d');
      this.effectIndex_ = 0;
      this.frame_ = 0;
      this.track_ = {faces:[]};
      this.effects_.init();
      this.renderFrame_();
    }.bind(this),
    function(err) {
      console.error('Failed to initialize the camera.');
      // Nothing to do when it failed.
    }
  );
  } else if (message.name == '') {

  }
});

var renderFrame_ = function() {
  if (!this.isVideoUsing)
    return;
  this.canvasContext_.drawImage(
      this.videoSource_, 0, 0, this.canvas_.width, this.canvas_.height);
  var effect = this.effects_.data[this.effectIndex_];
  /*
  if (effect.tracks && this.frame_ % this.frequency_ == 0) {
    this.track_ = this.tracker_.track(this.canvas_);
  }
  */
  this.effects_.advance(this.canvas_);
  effect.filter(this.canvas_, this.canvas_, this.frame_++, this.track_);
  requestAnimationFrame(
      this.renderFrame_);
};
