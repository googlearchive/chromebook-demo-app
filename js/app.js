var makeCenterBounds = function(width, height) {
  return {
    left: ~~((screen.availWidth - width) / 2 + screen.availLeft),
    top: ~~((screen.availHeight - height) / 2 + screen.availTop),
    width: width,
    height: height
  };
};

var App = function() {
  var initialBounds = Component.current().windowParams.state == 'maximized' ?
      makeCenterBounds(screen.availWidth, screen.availHeight) :
      Component.current().windowParams.bounds;
  this.windowBoundsList_ = [
    initialBounds,
    makeCenterBounds(1366, 720), /* Sumsung */
    makeCenterBounds(1280, 802), /* Pixel */
    makeCenterBounds(300, 300)
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

  // Loads locale strings.
  Locale.load(this.checkDocumentReady_.bind(this));

  // Get current locale.
  Component.ENTRIES.Helper.sendMessage({name: 'getLocale'}, function(localeID) {
    this.locale_ = chrome.runtime.lastError ? Locale.DEFAULT : localeID;
    this.checkDocumentReady_();
  }.bind(this));

  // Setup window.
  this.appWindow = window;
  this.window = window.contentWindow;
  this.windowBoundsIndex_ = 0;
  // If the state is normal, window size may be different because of last state
  // that is bounded with window id.
  // If the state is maximize, we don't change the bounds to avoid the window
  // from restoring the maximize state.
  if (Component.current().windowParams.state == 'normal')
    this.toggleWindowSize_();

  // Init the document.
  this.document = window.contentWindow.document;
  if (!this.checkDocumentReady_())
    this.window.addEventListener('load', this.checkDocumentReady_.bind(this));
};

App.prototype.checkDocumentReady_ = function() {
  if ((window.document.readyState == 'interactive' ||
       window.document.readyState == 'complete') &&
      Locale.loaded &&
      this.locale_ &&
      !this.documentInitialized_) {
    this.documentInitialized_ = true;
    this.initDocument();
    this.applyLocale(this.locale_);
    this.appWindow.show();
    return true;
  } else {
    return false;
  }
};

App.prototype.initDocument = function(firstTime) {
  // Close button.
  var closeButton = this.document.querySelector('.close');
  closeButton.addEventListener('click', function() {
    this.close();
  }.bind(this));

  var body = this.document.getElementsByTagName('body')[0];

  // Licence page.
  var menu = this.get('#context-menu');
  if (menu) {
    body.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      menu.classList.toggle('active', true);
      menu.style.left = (event.clientX + 2) + 'px';
      menu.style.top = (event.clientY + 2) + 'px';
    });
    body.addEventListener('click', function(event) {
      menu.classList.toggle('active', false);
    });
  }

  // Define shortcut key.
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
    } else if (e.ctrlKey && e.keyCode == 77) {
      this.appWindow.maximize();
    } else if (e.ctrlKey && e.keyCode == 73) {
      // Debug tool
    }
  }.bind(this));
};

App.prototype.close = function() {
  this.window.close();
};

App.prototype.get = function(query) {
  return this.document.querySelector(query);
};

App.prototype.applyLocale = function(locale) {
  console.debug('applyLocale', locale);

  // Replace i18n strings.
  Locale.apply(this.document, locale);

  // Apply initial DOM state.
  this.get('html').setAttribute('dir', chrome.i18n.getMessage("@@bidi_dir"));
  this.toggleDirection_(false);
};

App.prototype.toggleWindowSize_ = function() {
  var bounds = this.windowBoundsList_[this.windowBoundsIndex_];
  this.appWindow.restore();
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
  console.log(message);
  if (message.name == 'close') {
    if (this.appWindow)
      this.appWindow.close();
  } else if (message.name == 'applyLocale') {
    console.log('applyLocale');
    if (this.documentInitialized_)
      this.applyLocale(message.code);
  }
};
