var Component = function(name, idList, windowID, mainView, isChild) {
  this.name = name;
  this.idList = idList;
  this.windowID = windowID;
  this.mainView = mainView;
  this.isChild = isChild;
};

Component.ENTRIES = {};

Component.ENTRIES.Menu = new Component(
    'Menu',
    ['ejpaejipmgoifefhjkmnghkpaklpeadp'],
    'demo-menu-window',
    'menu-app.html',
    false);

Component.ENTRIES.Docs = new Component(
    'Docs',
    ['hniomhdmdnlgdfieanjadkdjkihjjfpf'],
    'demo-docs-window',
    'docs-app.html',
    true);

Component.ENTRIES.Hangouts = new Component(
    'Hangouts',
    ['bbfdbpldnkjjakidjnngddapfpmkpigp'],
    'demo-hangouts-window',
    'hangouts-app.html',
    true);

Component.ENTRIES.Music = new Component(
    'Music',
    ['kahjkkebhajdmaphhlommkhbcononjal'],
    'demo-music-window',
    'music-app.html',
    true);

Component.ENTRIES.Store = new Component(
    'Store',
    ['niichfgnefmnhfkmchpjjfdelgpillkc'],
    'demo-store-window',
    'store-app.html',
    true);

Component.ENTRIES.Helper = new Component(
    'Helper',
    ['dklepamkcpcemiendiebcmkdplnabpjp'],
    null,
    null,
    false);

Component.get = function(id) {
  for (var name in Component.ENTRIES) {
    if (Component.ENTRIES[name].idList.indexOf(id) != -1) {
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
  for (var i = 0; i < this.idList.length; i++) {
    if (responseHandler) {
      chrome.runtime.sendMessage(this.idList[i], message, responseHandler);
    } else {
      chrome.runtime.sendMessage(this.idList[i], message);
    }
  }
};

Apps = {};
Apps.YouTube = {
  idList: ['pbdihpaifchmclcmkfdgffnnpfbobefh']
};

var extend = function(base, adapter) {
  for (var name in adapter) {
    base[name] = adapter[name];
  }
  return base;
};

var queryXPath = function(doc, xpath) {
  var xPathResult = doc.evaluate(
      xpath, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  var results = [];
  for (var i = 0; i < xPathResult.snapshotLength; i++) {
    var node = xPathResult.snapshotItem(i);
    results.push(node);
  }
  return results;
};

Locale = {loaded: false, messages_: {}};

Locale.LIST = ['en'];

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

Locale.onXHRStateChange_ = function(xhr, id, callback) {
  if (xhr.readyState != 4)
    return;
  if (xhr.status == 200) {
    this.messages_[id] = JSON.parse(xhr.responseText);
  } else if (xhr.status == 404)
    this.messages_[id] = {};
  else
    this.messages_[id] = null;
  for (var i = 0; i < Locale.LIST.length; i++) {
    var inID = Locale.LIST[i];
    if (!this.messages_[inID])
      return;
  }
  Locale.loaded = true;
  callback();
};

Locale.get = function(id, messageName) {
  return this.messages_[id][messageName].message;
};

Locale.apply = function(document, id) {
  var nodes = queryXPath(document, '//*[@i18n-content]');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].innerHTML = nodes[i].innerHTML =
        this.get(id, nodes[i].getAttribute('i18n-content'));
  }
};
