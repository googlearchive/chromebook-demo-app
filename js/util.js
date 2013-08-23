'strict mode';

var DEBUG = true;

var Component = function(name, id, windowID, mainView, isChild) {
  this.name = name;
  this.id = id;
  this.windowID = windowID;
  this.mainView = mainView;
  this.isChild = isChild;
  this.windowParams = {
    resizable: false,
    frame: 'none',
    hidden: true,
    state: 'maximized'
  };
};

Component.ENTRIES = {};

Component.ENTRIES.Menu = new Component(
    'Menu',
    'nhpmmldpbfjofkipjaieeomhnmcgihfm',
    'demo-menu-window',
    'menu-app.html',
    false);

Component.ENTRIES.Docs = new Component(
    'Docs',
    'npnjdccdffhdndcbeappiamcehbhjibf',
    'demo-docs-window',
    'docs-app.html',
    true);

Component.ENTRIES.Hangouts = new Component(
    'Hangouts',
    'cgmlfbhkckbedohgdepgbkflommbfkep',
    'demo-hangouts-window',
    'hangouts-app.html',
    true);

Component.ENTRIES.Music = new Component(
    'Music',
    'onbhgdmifjebcabplolilidlpgeknifi',
    'demo-music-window',
    'music-app.html',
    true);

Component.ENTRIES.Store = new Component(
    'Store',
    'dhmdaeekeihmajjnmichlhiffffdbpde',
    'demo-store-window',
    'store-app.html',
    true);

Component.ENTRIES.Helper = new Component(
    'Helper',
    'edhhaiphkklkcfcbnlbpbiepchnkgkpn',
    null,
    null,
    false);

Component.get = function(id) {
  for (var name in Component.ENTRIES) {
    if (Component.ENTRIES[name].id == id) {
      return Component.ENTRIES[name];
    }
  }
  return null;
};

Component.current = function() {
  return Component.get(chrome.runtime.id);
};

Component.prototype.sendMessage = function(message, responseHandler) {
  if (responseHandler) {
    chrome.runtime.sendMessage(this.id, message, responseHandler);
  } else {
    chrome.runtime.sendMessage(this.id, message);
  }
};

var extend = function(base, adapter) {
  for (var name in adapter) {
    base[name] = adapter[name];
  }
  return base;
};

Locale = {loaded: false, messages_: {}};

Locale.LIST = [
    'da', 'de', 'en', 'en-gb', 'es', 'es-419', 'fr', 'it', 'ja', 'ko', 'ms',
    'nl', 'pt', 'ru', 'sv', 'zh', 'zh-tw', 'fi'];

Locale.DEFAULT = 'en';

/**
 * Load the current locale from the local strage.
 * This should be called in the helper extension.
 */
Locale.loadCurrentLocale = function() {
  var rawLocale = localStorage['locale'] ||
      chrome.i18n.getMessage('@@ui_locale');
  return this.getAvailableLocale(rawLocale);
};

Locale.saveCurrentLocale = function(code) {
  localStorage['locale'] = code;
};

Locale.getAvailableLocale = function(code) {
  code = code.toLowerCase().replace(/_/g, '-');
  for (var i = 0; i < Locale.LIST.length; i++) {
    if (code == Locale.LIST[i])
      return code;
  }
  if (code.indexOf('-') == -1)
    return Locale.DEFAULT;
  return this.getAvailableLocale(code.split('-', 2)[0]);
};

Locale.load = function(callback) {
  for (var i = 0; i < Locale.LIST.length; i++) {
    var id = Locale.LIST[i];
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange =
        this.onXHRStateChange_.bind(this, xhr, id, callback);
    xhr.open('GET', '_locales/' + id + '/messages.json');
    xhr.send();
  }
};

Locale.onXHRStateChange_ = function(xhr, lang, callback) {
  if (xhr.readyState != 4)
    return;
  if (xhr.status == 200)
    this.messages_[lang] = JSON.parse(xhr.responseText);
  else
    this.messages_[lang] = {};
  // Check if the all languages have already loaded or not.
  for (var i = 0; i < Locale.LIST.length; i++) {
    var inLang = Locale.LIST[i];
    if (this.messages_[inLang]) {
      if (inLang != Locale.DEFAULT)
        this.messages_[inLang].__proto__ = this.messages_[Locale.DEFAULT];
    } else {
      return;
    }
  }
  Locale.loaded = true;
  callback();
};

/**
 * The id must be one of the Locale.LIST items.
 */
Locale.get = function(lang, messageName) {
  var localeEntry = this.messages_[lang][messageName];
  if (!localeEntry)
    console.error('Cannot find the locale string:' + messageName);
  return localeEntry.message;
};

Locale.apply = function(document, lang) {
  var nodes = document.querySelectorAll('[i18n-content]');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerHTML = nodes[i].innerHTML =
        this.get(lang, nodes[i].getAttribute('i18n-content'));
  }
  nodes = document.querySelectorAll('[i18n-attr-name][i18n-attr-value]');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].setAttribute(
        nodes[i].getAttribute('i18n-attr-name'),
        this.get(lang, nodes[i].getAttribute('i18n-attr-value')));
  }
};

var Logo = function(element) {
  this.element_ = element;
  this.intervalID_ = null;
};

Logo.prototype.start = function() {
  this.element_.addEventListener('mouseover', this.onMouseOver_.bind(this));
};

Logo.prototype.onMouseOver_ = function(event) {
  if (this.intervalID_ != null)
    return;
  this.count_ = 0;
  this.intervalID_ = setInterval(Logo.prototype.onStep_.bind(this), 25);
};

Logo.NUM_FRAMES = 40;

Logo.prototype.onStep_ = function(event) {
  if (this.count_ > Logo.NUM_FRAMES) {
    this.element_.style.webkitMask = '';
    clearInterval(this.intervalID_);
    this.intervalID_ = null;
    return;
  }
  var size = (1 - Math.cos(this.count_ * Math.PI / 2 / Logo.NUM_FRAMES)) * 165;
  var gradient = '-webkit-radial-gradient(' + [
    '16px 15px',
    'circle',
    'rgb(0, 0, 0) ' + size + 'px',
    'rgba(0, 0, 0, 0) ' + (size + 5) + 'px',
    'rgb(0, 0, 0) ' + (size + 10) + 'px'
  ].join(', ')+ ')';
  this.element_.style.webkitMask = gradient;
  this.count_++;
};
