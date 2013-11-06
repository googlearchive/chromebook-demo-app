'use strict';

var service;
var tracker;

function visit(url) {
  var params = {url: url};
  chrome.tabs.create(params, function(tab) {
    if (tab) {
      chrome.windows.update(tab.windowId, {focused: true});
      return;
    }
    // Fallback for the case that there is no window.
    chrome.windows.create(params);
  });
};

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    // If the message comes from an unknown extension, just ignore it.
    var senderComponent = Component.get(sender.id);
    if (!senderComponent &&
        request.name != 'getLocale' &&
        request.name != 'applyLocale')
      return false;
    switch (request.name) {
      case 'launch':
        var ids = request.id;
        if (!(ids instanceof Array))
          ids = [ids];
        for (var i = 0; i < ids.length; i++) {
          chrome.management.launchApp(ids[i]);
        }
        break;

      case 'getPackApps':
        var packs = [];
        chrome.management.getAll(function(extensions) {
          for (var i = 0; i < extensions.length; i++) {
            if (Component.PACKS.indexOf(extensions[i].id) != -1)
              packs.push(extensions[i].id);
          }
          sendResponse(packs);
        });
        return true;

      case 'visitLearnMore':
        visit('learn-more.html');
        break;

      case 'visitStore':
        visit('https://chrome.google.com/webstore/category/apps');
        break;

      case 'trackView':
        service = service || analytics.getService('Chromebook Retail Demo');
        tracker = tracker || service.getTracker('UA-42807255-2');
        tracker.sendAppView(senderComponent.name);
        break;

      case 'getLocale':
        sendResponse(Locale.loadCurrentLocale());
        break;

      case 'applyLocale':
        Locale.saveCurrentLocale(request.code);
        break;
    }
    return false;
  }
);
