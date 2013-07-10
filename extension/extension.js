var GAME_EXTENSION_ID = 'mjajejaiccbocnmmcagnpkgceebphgpe';

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('here');
    if (request.name == 'launchGame') {
      // Launch a game.
      chrome.management.launchApp(GAME_EXTENSION_ID);
    }
  }
);
