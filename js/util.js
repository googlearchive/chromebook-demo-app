var extend = function(base, adapter) {
  for (var name in adapter) {
    base[name] = adapter[name];
  }
  return base;
};

var sendMessage = function(ids, message) {
  for (var i = 0; i < ids.length; i++) {
    chrome.runtime.sendMessage(ids[i], message);
  }
};
