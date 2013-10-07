'use strict';

var service;
var tracker;

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

      case 'visitLearnMore':
        var params = {url: 'learn-more.html'};
        chrome.tabs.create(params, function(tab) {
          if (tab)
            return;
          // Fallback for the case that there is no window.
          chrome.windows.create(params);
        });
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
