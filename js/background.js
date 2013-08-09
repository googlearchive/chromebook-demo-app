chrome.app.runtime.onLaunched.addListener(function(event) {
  // If it is a child app, Close the other child apps.
  var transparent;
  var current = Component.current();
  var params = {
    id: current.windowID,
    resizable: false,
    frame: 'none',
    hidden: true
  };
  if (current.isChild) {
    for (var name in Component.ENTRIES) {
      var component = Component.ENTRIES[name];
      if (component != Component.current() && component.isChild)
        component.sendMessage({name: 'close'});
    }
    params.state = 'maximized';
    params.transparentBackground = false;
  } else {
    params.state = 'normal';
    params.transparentBackground = true;
    params.bounds = {
      left: screen.availLeft, top: screen.availTop,
      width: screen.availWidth, height: screen.availHeight
    };
  }
  chrome.app.window.create(current.mainView, params);
});
