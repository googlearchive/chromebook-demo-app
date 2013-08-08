var makeCenterBounds = function(width, height) {
  return {
    left: ~~((screen.availWidth - width) / 2 + screen.availLeft),
    top: ~~((screen.availHeight - height) / 2 + screen.availTop),
    width: width,
    height: height
  };
};

var App = function(opt_width, opt_height, opt_transparent) {
  this.transparent_ = !!opt_transparent;
  this.windowBoundsList_ = [
    makeCenterBounds(opt_width || screen.availWidth,
                     opt_height || screen.availHeight),
    makeCenterBounds(1366, 720),
    makeCenterBounds(1280, 802)
  ];
  this.windowBoundsIndex_ = 0;
};

App.prototype.start = function() {
  var window = chrome.app.window.current();
  if (window.initialized)
    return;
  window.initialized = true;

  // Register window events.
  chrome.runtime.onMessageExternal.addListener(this.onMessage_.bind(this));

  // Track page view.
  Component.ENTRIES.Helper.sendMessage({name: 'trackView'});

  // Setup window.
  this.appWindow = window;
  this.window = window.contentWindow;
  this.windowBoundsIndex_ = 0;
  this.toggleWindowSize_();

  // Init the document.
  this.document = window.contentWindow.document;
  callAfterLoading(window.contentWindow, this.initDocument.bind(this));
};

App.queryXPath = function(doc, xpath) {
  var xPathResult = doc.evaluate(
      xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var results = [];
  for (var i = 0; i < xPathResult.snapshotLength; i++) {
    var node = xPathResult.snapshotItem(i);
    results.push(node);
  }
  return results;
};

App.prototype.initDocument = function(firstTime) {
  // Replace i18n strings.
  var nodes = App.queryXPath(
      this.document, '//*[contains(./text(), \'__MSG_\')]');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerHTML = nodes[i].innerHTML.replace(
        /__MSG_([a-zA-Z0-9_]+)__/g,
        function(str) {
          return chrome.i18n.getMessage(RegExp.$1);
        });
  }
  var attributes = App.queryXPath(
      this.document, '//@*[contains(., \'__MSG_\')]');
  for (var i = 0; i < attributes.length; i++) {
    attributes[i].nodeValue = attributes[i].nodeValue.replace(
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

  // Define shortcut key.
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
      chrome.storage.local.clear();
    } else if (e.ctrlKey && e.keyCode == 82) {
      chrome.runtime.reload();
    }
  }.bind(this));

  // Show window.
  this.appWindow.show();
};

App.prototype.close = function() {
  this.window.close();
};

App.prototype.get = function(query) {
  return this.document.querySelector(query);
};

App.prototype.toggleWindowSize_ = function() {
  var bounds = this.windowBoundsList_[this.windowBoundsIndex_];
  this.appWindow.setBounds(bounds);
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
