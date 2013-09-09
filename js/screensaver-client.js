chrome.runtime.onMessage.addListener(function(request) {
  switch (request.name) {
    case 'closeScreensaver':
      window.close();
      break;
  }
});
