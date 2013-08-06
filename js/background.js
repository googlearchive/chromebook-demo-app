chrome.app.runtime.onLaunched.addListener(function(event) {
  // If it is a child app, Close the other child apps.
  var transparent;
  var current = Component.current();
  if (current.isChild) {
    for (var name in Component.ENTRIES) {
      var component = Component.ENTRIES[name];
      if (component != Component.current() && component.isChild)
        component.sendMessage({name: 'close'});
    }
    transparent = false;
  } else {
    transparent = true;
  }
  chrome.app.window.create(current.mainView, {
    id: current.windowID,
    hidden: true,
    resizable: false,
    frame: 'none',
    transparentBackground: transparent
  });
});
