var service;
var tracker;

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    var senderName;
    if (MENU_APP_ID_LIST.indexOf(sender.id) != -1)
      senderName = 'Menu';
    else if (DOCS_APP_ID_LIST.indexOf(sender.id) != -1)
      senderName = 'Docs';
    else if (HANGOUTS_APP_ID_LIST.indexOf(sender.id) != -1)
      senderName = 'Hangouts';
    else if (MUSIC_APP_ID_LIST.indexOf(sender.id) != -1)
      senderName = 'Music';
    else if (STORE_APP_ID_LIST.indexOf(sender.id) != -1)
      senderName = 'Store';
    else
      return;
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
        tracker = tracker || service.getTracker('UA-42807255-1'/*'UA-42968273-1'*/);
        tracker.sendAppView(senderName);
        break;
    }
  }
);
