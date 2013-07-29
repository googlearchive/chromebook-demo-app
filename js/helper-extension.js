chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    switch (request.name) {
      case 'launchDocs':
        chrome.management.launchApp(DOCS_APP_ID);
        break;
      case 'launchHangouts':
        chrome.management.launchApp(HANGOUTS_APP_ID);
        break;
      case 'launchMusic':
        chrome.management.launchApp(MUSIC_APP_ID);
        break;
      case 'launchStore':
        chrome.management.launchApp(STORE_APP_ID);
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
