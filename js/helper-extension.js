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
                Component.ENTRIES.Docs.idList.indexOf(id) == -1 &&
                Component.ENTRIES.Hangouts.idList.indexOf(id) == -1 &&
                Component.ENTRIES.Music.idList.indexOf(id) == -1 &&
                Component.ENTRIES.Store.idList.indexOf(id) == -1) {
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
                               width: 290, height: 120});
        break;

      case 'getLocale':
        var locale = localStorage['locale'] ||
            chrome.i18n.getMessage('@@ui_locale');
        sendResponse(Locale.getAvailableLocale(locale));
        break;

      case 'applyLocale':
        localStorage['locale'] = request.code;
        break;
    }
    return false;
  }
);
