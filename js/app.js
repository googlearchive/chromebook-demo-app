var App = function(id, html, transparent) {
  this.id_ = id;
  this.html_ = html;
  this.transparent_ = transparent;
};

App.prototype.start = function() {
  // Register events.
  chrome.app.runtime.onLaunched.addListener(this.onLaunched_.bind(this));
};

App.prototype.onLaunched_ = function() {
  chrome.app.window.create(this.html_, {
    id: this.id_,
    hidden: true,
    resizable: false,
    frame: 'none',
    transparentBackground: this.transparent_
  }, this.onWindowCreated_.bind(this));
};

App.prototype.onWindowCreated_ = function(window) {
  if (window.initialized)
    return;
  window.initialized = true;
  // Setup window.
  this.appWindow = window;
  this.window = window.contentWindow;
  window.setBounds({
    left: 0,
    top: 0,
    width: screen.width,
    height: screen.height
  });
  window.show();

  // Init the document.
  this.document = window.contentWindow.document;
  callAfterLoading(window.contentWindow, this.initDocument.bind(this));
};

App.prototype.initDocument = function(firstTime) {
  // Close button
  var closeButton = this.document.querySelector('.close');
  closeButton.addEventListener('click', function() {
    this.window.close();
  }.bind(this));

  // Close shortcut key.
  var body = this.document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', function(e) {
    if (e.keyCode == 27) {
      this.window.close();
    }
  }.bind(this));
};

var callAfterLoading = function(window, callback) {
  if (window.document.readyState == 'interactive' ||
      window.document.readyState == 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
};
