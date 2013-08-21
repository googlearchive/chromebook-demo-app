chrome.app.runtime.onLaunched.addListener(function(event) {
  // If it is a child app, Close the other child apps.
  var current = Component.current();
  if (current.isChild) {
    for (var name in Component.ENTRIES) {
      var component = Component.ENTRIES[name];
      if (component != Component.current() && component.isChild)
        component.sendMessage({name: 'close'});
    }
  }
  chrome.app.window.create(current.mainView, current.windowParams);
});
