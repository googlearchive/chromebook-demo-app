'use strict';

var makeCenterBounds = function(width, height) {
  return {
    left: ~~((screen.availWidth - width) / 2 + screen.availLeft),
    top: ~~((screen.availHeight - height) / 2 + screen.availTop),
    width: width,
    height: height
  };
};

var Sidebar = function(element) {
  // Element.
  this.document_ = element.ownerDocument;
  this.element_ = element;
  this.texts_ = this.element_.querySelectorAll(
      ':-webkit-any(.app-copy, .app-sub-copy, .app-description, .sec-header,' +
      '.sec-description, .app-hint-title)');
  this.hintTitle_ = this.element_.querySelector('.app-hint-title');
  this.hintDescription_ = this.element_.querySelector('.app-hint-description');
  this.dynamicStyle_ = this.document_.querySelector('#dynamic-styles');

  // Compute constant style values.
  this.usedHeight_ =
      this.getChildStyleValue_('.app-side-body', 'paddingTop') +
      this.getChildStyleValue_('.app-icon', 'height') +
      this.getChildStyleValue_('.app-side-footer', 'paddingTop') +
      this.getChildStyleValue_('.app-side-footer', 'paddingBottom');
};

Sidebar.prototype.getChildStyleValue_ = function(selector, property) {
  return parseInt(
      getComputedStyle(this.element_.querySelector(selector))[property]);
};

Sidebar.prototype.layout = function(opt_height) {
  var wholeHeight = (opt_height || screen.availHeight);
  for (var small = false; true; small = !small) {
    this.element_.classList.toggle('small', small);
    var textHeight = 0;
    for (var i = 0; i < this.texts_.length; i++) {
      textHeight += this.texts_[i].getBoundingClientRect().height;
    }
    var marginHeight = wholeHeight - this.usedHeight_ - textHeight;
    var marginUnit = ~~Math.min(25, Math.max(marginHeight / 12, 0));
    var hintTitleHeight = this.hintTitle_.getBoundingClientRect().height;
    var hintDescriptionHeight =
        this.hintDescription_.getBoundingClientRect().height;
    if (marginUnit > 8 || small)
      break;
  }
  this.dynamicStyle_.innerText +=
      '.app-frame .app-description,' +
      '.app-frame .sec-description {' +
      '  margin-top: ' + marginUnit + 'px;' +
      '  margin-bottom: ' + (marginUnit * 2) + 'px;' +
      '}' +
      '.app-frame .app-side-footer {' +
      '  height: ' + hintTitleHeight + 'px;' +
      '}' +
      '.app-frame .app-side-footer:hover {' +
      '  height: ' + (hintTitleHeight + hintDescriptionHeight) + 'px;' +
      '}';
};

var App = function() {
  /**
   * Initial locale.
   */
  this.initialLocale = null;

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
    this.initialLocale = chrome.runtime.lastError ? Locale.DEFAULT : localeID;
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
      this.initialLocale &&
      !this.documentInitialized_) {
    this.documentInitialized_ = true;
    this.initDocument();
    this.applyLocale(this.initialLocale);
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

  // Document
  var body = this.document.body;
  this.dynamicStyle_ = this.document.createElement('style');
  this.dynamicStyle_.id = 'dynamic-styles';
  this.document.head.appendChild(this.dynamicStyle_);

  // Sidebar
  var sidebarElement = this.document.querySelector('.app-side');
  if (sidebarElement)
    this.sidebar_ = new Sidebar(sidebarElement);

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
  // Replace i18n strings.
  Locale.apply(this.document, locale);

  // Apply initial DOM state.
  this.get('html').setAttribute('dir', chrome.i18n.getMessage("@@bidi_dir"));
  this.toggleDirection_(false);

  // If the application has the side view, layout it.
  this.updateLayout(this.appWindow.getBounds().height);
};

App.prototype.updateLayout = function(opt_height) {
  this.dynamicStyle_.innerText = '';
  if (this.sidebar_)
    this.sidebar_.layout(opt_height);
  return;
};

App.prototype.toggleWindowSize_ = function() {
  var bounds = this.windowBoundsList_[this.windowBoundsIndex_];
  this.appWindow.restore();
  this.appWindow.setBounds(bounds);
  this.windowBoundsIndex_++;
  this.windowBoundsIndex_ %= this.windowBoundsList_.length;
  this.updateLayout(bounds.height);
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
  } else if (message.name == 'applyLocale') {
    if (this.documentInitialized_)
      this.applyLocale(message.code);
  }
};
