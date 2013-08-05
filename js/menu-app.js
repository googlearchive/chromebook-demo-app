var MenuApp = function() {
  this.chromeVersion_ =
      parseInt(navigator.appVersion.match(/Chrome\/([0-9]+)/)[1]);
  this.isTransparent_ = this.chromeVersion_ >= 28;
  var width = this.isTransparent_ ? 0 : 800;
  var height = this.isTransparent_ ? 0 : 600;
  App.call(this, MENU_WINDOW_ID, 'menu-app.html',
           width, height, this.isTransparent_);
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

  // Init rotation.
  this.inHover_ = 0;
  this.rotationCounter_ = 0;
  this.rotationID_ = setInterval(this.onStep_.bind(this), 500);
  this.onStep_();

  // Update the CSS class.
  var appFrame = this.get('.app-frame');
  if (this.isTransparent_)
    appFrame.classList.add('transparent');
  appFrame.classList.remove('loading');

  // Child application buttons.
  var buttons = this.document.querySelectorAll('.button');
  for (var i = 0; i < buttons.length; i++) {
    // Click - launch the child applications.
    buttons[i].addEventListener('click', function(index) {
      var id = [
        DOCS_APP_ID_LIST,
        HANGOUTS_APP_ID_LIST,
        MUSIC_APP_ID_LIST,
        STORE_APP_ID_LIST
      ][index];
      sendMessage(HELPER_EXTENSION_ID_LIST, {name: 'launch', id: id});
    }.bind(this, i));

    // Hover - reset rotation counter.
    buttons[i].addEventListener('mouseover', this.onHover_.bind(this, true));
    buttons[i].addEventListener('mouseout', this.onHover_.bind(this, false));
  }

  // Learn more link.
  this.get('.learn-more').addEventListener('click', function() {
    sendMessage(HELPER_EXTENSION_ID_LIST, {name: 'visitLearnMore'});
  });
};

MenuApp.prototype.close = function() {
  if (this.rotationID_) {
    clearInterval(this.rotationID_);
    this.rotationID_ = null;
  }
  App.prototype.close.call(this);
};

MenuApp.prototype.onHover_ = function(f) {
  this.inHover_ = f;
  this.rotationCounter_ = 0;
  this.onStep_();
};

MenuApp.prototype.onStep_ = function() {
  // Rotate the highlight bars.
  var buttons = [
    '.docs.button',
    '.hangouts.button',
    '.music.button',
    '.store.button'
  ];
  var step = ~~(this.rotationCounter_ / 2) - 2;
  var target = step < 0 || (step % 3) == 2 ? -1 : ~~(step / 3) % buttons.length;
  for (var i = 0; i < buttons.length; i++) {
    this.get(buttons[i]).classList.toggle('rotated', target == i);
  }
  this.rotationCounter_ = this.inHover_ ? 0 : this.rotationCounter_ + 1;
};

MenuApp.prototype.downloadSampleFiles = function() {
  var steps = [
    function() {
      chrome.storage.local.get('sampleFileDownloaded', steps.shift());
    },
    function(storage) {
      var flag = !!storage.sampleFileDownloaded;
      if (flag)
        return;
      chrome.storage.local.set({sampleFileDownloaded: true}, steps.shift());
    },
    function() {
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
