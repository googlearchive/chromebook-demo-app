var MenuApp = function() {
  this.chromeVersion_ =
      parseInt(navigator.appVersion.match(/Chrome\/([0-9]+)/)[1]);
  this.isTransparent_ = this.chromeVersion_ >= 28;
  var width = this.isTransparent_ ? 0 : 800;
  var height = this.isTransparent_ ? 0 : 600;
  App.call(this, MENU_WINDOW_ID, 'menu-app.html',
           width, height, this.isTransparentUsing_);
};

MenuApp.prototype = {
  __proto__: App.prototype
};

MenuApp.prototype.start = function() {
  App.prototype.start.call(this);

  chrome.app.runtime.onLaunched.addListener(
      this.downloadSampleFiles.bind(this));
  this.downloadSampleFiles();
};

MenuApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Update the CSS class
  var appFrame = this.get('.app-frame');
  if (this.isTransparent_)
    appFrame.classList.add('transparent');
  appFrame.classList.remove('loading');

  // Child application buttons
  var buttons = this.document.querySelectorAll('.button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(index) {
      var id = [
        DOCS_APP_ID,
        HANGOUTS_APP_ID,
        MUSIC_APP_ID,
        STORE_APP_ID
      ][index];
      chrome.runtime.sendMessage(
          HELPER_EXTENSION_ID, {name: 'launch', id: id});
    }.bind(this, i));
  }

  // Learn more link
  this.get('.learn-more').addEventListener('click', function() {
    chrome.runtime.sendMessage(HELPER_EXTENSION_ID, {name: 'visitLearnMore'});
  });
};

MenuApp.prototype.downloadSampleFiles = function() {
  var steps = [
    function() {
      chrome.storage.local.get('sampleFileDownloaded', steps.shift());
    },
    function(storage) {
      var flag = !!storage.sampleFileDownloaded;
      console.log(flag);
      if (flag)
        return;
      chrome.storage.local.set({sampleFileDownloaded: true}, steps.shift());
    },
    function() {
      console.log(chrome.runtime.lastError);
      if (chrome.runtime.lastError)
        return;
      var files = [
        '1995 Field Notes.docx',
        'Arches.png',
        'Chromebook Backup.mov',
        'Night.png',
        'Song.mp3'
      ];
      for (var i = 0; i < files.length; i++) {
        chrome.app.window.create(
            'downloader.html?url=' + files[i] + '&filename=' + files[i], {
               id: 'demo-download-window',
               singleton: false,
               hidden: true
            });
      }
    }
  ];
  steps.shift()();
};

new MenuApp().start();
