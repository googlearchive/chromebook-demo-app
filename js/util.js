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

Component.prototype.sendMessage = function(message) {
  for (var i = 0; i < this.idList.length; i++) {
    chrome.runtime.sendMessage(this.idList[i], message);
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
