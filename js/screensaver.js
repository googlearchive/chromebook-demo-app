var Screensaver = function() {

};

Screensaver.prototype.start = function() {
  chrome.power.requestKeepAwake('display');
  chrome.idle.setDetectionInterval(60 * 5);
  chrome.idle.onStateChanged.addListener(this.onIdleStateChange_.bind(this));
};

Screensaver.prototype.onIdleStateChange_ = function(state) {
  switch (state) {
    case 'active':
      chrome.runtime.sendMessage({name: 'closeScreensaver'});
      launch();
      break;
    case 'idle':
      chrome.app.window.create('screensaver.html', {
        id: 'screensaver',
        state: 'fullscreen'
      }, function(appWindow) {
        // If the state is fullscreen, 'resizable: false' does not work.
        // The window can be restored by pressing the functional key.
        // Once it is restored, the wrong window state is loaded by referring
        // window ID.
        if (!appWindow.isFullscreen())
          appWindow.fullscreen();
      });
      break;
  }
};

new Screensaver().start();
