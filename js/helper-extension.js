'use strict';

var service;
var tracker;

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    // If the message comes from an unknown extension, just ignore it.
    var senderComponent = Component.get(sender.id);
    if (!senderComponent)
      return false;
    var senderName = senderComponent.name;
    switch (request.name) {
      case 'launch':
        var ids = request.id;
        if (!(ids instanceof Array))
          ids = [ids];
        for (var i = 0; i < ids.length; i++) {
          chrome.management.launchApp(ids[i], function(id) {
            if (DEBUG &&
                chrome.runtime.lastError &&
                Component.ENTRIES.Docs.id != id &&
                Component.ENTRIES.Hangouts.id != id &&
                Component.ENTRIES.Music.id != id &&
                Component.ENTRIES.Store.id != id) {
              var urlPrefix = 'https://chrome.google.com/webstore/detail/';
              chrome.tabs.create({url: urlPrefix + id});
            }
          }.bind(null, ids[i]));
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
        tracker.sendAppView(senderName);
        break;

      case 'showLicencePage':
        chrome.windows.create({url: 'licence.html',
                               type: 'popup',
                               width: 290, height: 240});
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
