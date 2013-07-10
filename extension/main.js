chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('here');
    if (request.name == 'launchGame') {
      // Launch a game.
      chrome.management.launchApp('mjajejaiccbocnmmcagnpkgceebphgpe');
    }
  }
);
