var MenuApp = function() {
  App.call(this, MENU_WINDOW_ID, 'menu-app.html', true);
};

MenuApp.prototype = {
  __proto__: App.prototype
};

MenuApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Child application buttons
  var buttons = this.document.querySelectorAll('.button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(index) {
      var messageName = [
        'launchDocs',
        'launchHangouts',
        'launchMusic',
        'launchStore'
      ][index];
      chrome.runtime.sendMessage(HELPER_EXTENSION_ID, {name: messageName});
    }.bind(this, i));
  }

  // Learn more link
  this.get('.learn-more').addEventListener('click', function() {
    chrome.runtime.sendMessage(HELPER_EXTENSION_ID, {name: 'visitLearnMore'});
  });
};

new MenuApp().start();
