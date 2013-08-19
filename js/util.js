var DEBUG = true;

var Component = function(name, id, windowID, mainView, isChild) {
  this.name = name;
  this.id = id;
  this.windowID = windowID;
  this.mainView = mainView;
  this.isChild = isChild;
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
  console.error('Cannot find the current component.');
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

Locale.LIST = ['en', 'ja'];

Locale.DEFAULT = 'en';

Locale.getAvailableLocale = function(code) {
  for (var i = 0; i < Locale.LIST.length; i++) {
    if (code == Locale.LIST[i])
      return code;
  }
  if (code.indexOf('_') == -1)
    return Locale.DEFAULT;
  return this.getAvailableLocale(code.split('_', 2)[0]);
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
