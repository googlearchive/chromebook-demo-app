chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (sender.id != MENU_APP_ID &&
        sender.id != STORE_APP_ID)
      return;
    switch (request.name) {
      case 'launch':
        chrome.management.launchApp(request.id);
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
    }
  }
);
