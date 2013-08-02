var ensureSampleFileAdded = function() {
  if (localStorage['sampleFileAdded'])
    return;
  chrome.window.create({url: ''});
};

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if ([].concat(MENU_APP_ID_LIST, STORE_APP_ID_LIST).indexOf(sender.id) == -1)
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
    }
  }
);
