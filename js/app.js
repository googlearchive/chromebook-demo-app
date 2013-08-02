var makeCenterBounds = function(width, height) {
  return {
    left: (screen.width - width) / 2,
    top: (screen.height - height) / 2,
    width: width,
    height: height
  };
};

var App = function(id, html, opt_width, opt_height, opt_transparent) {
  this.id_ = id;
  this.html_ = html;
  this.transparent_ = !!opt_transparent;
  this.windowBoundsList_ = [
    makeCenterBounds(opt_width || screen.width, opt_height || screen.height),
    makeCenterBounds(1280, 800),
    makeCenterBounds(1366, 768)
  ];
  this.windowBoundsIndex_ = 0;
};

App.prototype.start = function() {
  // Register events.
  chrome.app.runtime.onLaunched.addListener(this.onLaunched_.bind(this));
  chrome.runtime.onMessageExternal.addListener(this.onMessage_.bind(this));
};

App.prototype.onLaunched_ = function() {
  // If it is a child app, Close the other child apps.
  var childAppIDs = [].concat(
      DOCS_APP_ID_LIST, HANGOUTS_APP_ID_LIST,
      MUSIC_APP_ID_LIST, STORE_APP_ID_LIST);
  var idIndex = childAppIDs.indexOf(chrome.runtime.id);
  if (idIndex != -1) {
    childAppIDs.splice(idIndex, 1);
    for (var i = 0; i < childAppIDs.length; i++) {
      chrome.runtime.sendMessage(childAppIDs[i], {name: 'close'});
    }
  }

  // Create window.
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
  this.windowBoundsIndex_ = 0;
  this.toggleWindowSize_();
  window.show();

  // Init the document.
  this.document = window.contentWindow.document;
  callAfterLoading(window.contentWindow, this.initDocument.bind(this));
};

App.prototype.initDocument = function(firstTime) {
  // Apply the locale messages.
  var result = this.document.evaluate(
      '//text()[contains(., \'__MSG_\')]',
      this.document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null);
  for (var i = 0; i < result.snapshotLength; i++) {
    var textNode = result.snapshotItem(i);
    textNode.nodeValue = textNode.nodeValue.replace(
        /__MSG_([a-zA-Z0-9_]+)__/g,
        function(str) {
          return chrome.i18n.getMessage(RegExp.$1);
        });
  }

  // Apply initial DOM state.
  this.get('html').setAttribute('dir', chrome.i18n.getMessage("@@bidi_dir"));
  this.toggleDirection_(false);

  // Close button.
  var closeButton = this.document.querySelector('.close');
  closeButton.addEventListener('click', function() {
    this.close();
  }.bind(this));

  // Close shortcut key.
  var body = this.document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', function(e) {
    // Closing
    if (e.keyCode == 27) {
      this.close();
    } else if (e.ctrlKey && e.keyCode == 83) {
      this.toggleWindowSize_();
    } else if (e.ctrlKey && e.keyCode == 68) {
      this.toggleDirection_(true);
    } else if (e.ctrlKey && e.keyCode == 67) {
      console.log('Clear storage.');
      chrome.storage.local.clear();
    }
  }.bind(this));
};

App.prototype.close = function() {
  this.window.close();
};

App.prototype.get = function(query) {
  return this.document.querySelector(query);
};

App.prototype.toggleWindowSize_ = function() {
  this.appWindow.setBounds(
          this.windowBoundsList_[this.windowBoundsIndex_]);
  this.windowBoundsIndex_++;
  this.windowBoundsIndex_ %= this.windowBoundsList_.length;
};

App.prototype.toggleDirection_ = function(toggle) {
  // Update the direction attribute.
  if (toggle) {
    var html = this.get('html');
    var oppositeDirection = {rtl: 'ltr', ltr: 'rtl'};
    html.setAttribute('dir', oppositeDirection[html.getAttribute('dir')]);
  }

  // Force to update the CSS.
  var result = this.document.evaluate(
      '//*',
      this.document,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null);
  var RTL_PROPERTIES = [
    'webkitMarginStart',
    'webkitMarginEnd',
    'webkitBorderStart',
    'webkitBorderEnd'
  ];
  for (var i = 0; i < result.snapshotLength; i++) {
    var element = result.snapshotItem(i);
    for (var j = 0; j < RTL_PROPERTIES.length; j++) {
      var property = RTL_PROPERTIES[j];
      if (element.style[property]) {
        element.style[property] = element.style[property];
      }
    }
  }
};

App.prototype.onMessage_ = function(message) {
  if (message.name == 'close') {
    if (this.appWindow)
      this.appWindow.close();
  }
};

var callAfterLoading = function(window, callback) {
  if (window.document.readyState == 'interactive' ||
      window.document.readyState == 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
};
