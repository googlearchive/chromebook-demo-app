var appWindow = null;

var launch = function(event) {
  if (appWindow) {
    if (!(appWindow instanceof String)) {
      appWindow.show();
      appWindow.drawAttention();
    }
    return;
  }
  appWindow = 'creating';
  // If it is a child app, Close the other child apps.
  var current = Component.current();
  if (current.isChild) {
    for (var name in Component.ENTRIES) {
      var component = Component.ENTRIES[name];
      if (component != Component.current() && component && component.isChild)
        component.sendMessage({name: 'close'});
    }
  }
  chrome.app.window.create(
      current.mainView, current.windowParams, function(inAppWindow) {
    appWindow = inAppWindow;
    appWindow.onClosed.addListener(function() {
      appWindow = null;
    });
  });
};

chrome.app.runtime.onLaunched.addListener(launch);
