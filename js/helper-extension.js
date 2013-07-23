chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('message received', request);
    switch (request.name) {
      case 'launchDocs':
        chrome.management.launchApp(DOCS_APP_ID);
        break;
      case 'launchHangouts':
        chrome.management.launchApp(HANGOUTS_APP_ID);
        break;
      case 'launchPlay':
        chrome.management.launchApp(PLAY_APP_ID);
        break;
      case 'launchGame':
        chrome.management.launchApp(GAME_APP_ID);
        break;
    }
  }
);
