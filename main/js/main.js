var MAIN_WINDOW_ID = "demo.app_main";
var MENU_PAGE_INDEX = 0;
var DOCS_PAGE_INDEX = 1;
var HANGOUTS_PAGE_INDEX = 2;
var PLAY_PAGE_INDEX = 3;
var GAME_PAGE_INDEX = 4;

/**
 * The helper extension ID.
 * These IDs are fixed by the key value in the manifest of extension helper.
 */
var EXTENSION_HELPER_ID = "dklepamkcpcemiendiebcmkdplnabpjp";

var Effects = defined.shift();
var FaceTracker = defined.shift();

var Page = function(root, id) {
  /**
   * @protected
   */
  this.root = root;
  this.handlers = new HandlerList();
  this.id_ = id;
};

Page.prototype.enter = function() {
  var doc = this.root.document;
  this.element_ = doc.getElementById(this.id_);
  this.element_.setAttribute('active', '');
};

Page.prototype.leave = function() {
  this.handlers.reset();
  this.element_.removeAttribute('active');
  this.element_ = null;
};

var MenuPage = function(root) {
  Page.call(this, root, 'menu-app');
};

MenuPage.prototype = Object.create(Page.prototype, {});

MenuPage.prototype.enter = function() {
  Page.prototype.enter.call(this);
  var doc = this.root.document;

  // Close button
  var closeButton = this.element_.querySelector('.close');
  this.handlers.add(closeButton, 'click', function() {
    this.root.exit();
  }.bind(this));

  // Child application buttons
  var buttons = doc.querySelectorAll('.button');
  for (var i = 0; i < buttons.length; i++) {
    this.handlers.add(buttons[i], 'click', function(index) {
      // Add 1 because the index 0 is for the menu page.
      this.root.switchToPage(index + 1);
    }.bind(this, i));
  }
};

MenuPage.prototype.leave = function() {
  Page.prototype.leave.call(this);
};

var AppPage = function(root, id) {
  Page.call(this, root, id);
};

AppPage.prototype = Object.create(Page.prototype, {});

AppPage.prototype.enter = function() {
  Page.prototype.enter.call(this);
  var doc = this.root.document;

  // Close button
  var closeButton = this.element_.querySelector('.close');
  this.handlers.add(closeButton, 'click', function() {
    this.root.switchToPage(MENU_PAGE_INDEX);
  }.bind(this));

  // Close shortcut key.
  var body = doc.getElementsByTagName('body')[0];
  this.handlers.add(body, 'keydown', function(e) {
    if (e.keyCode == 27) {
      this.root.switchToPage(MENU_PAGE_INDEX);
    }
  }.bind(this));
};

var DocsPage = function(root) {
  AppPage.call(this, root, 'docs-app');
};

DocsPage.prototype = Object.create(AppPage.prototype, {});

var HangoutsPage = function(root) {
  AppPage.call(this, root, 'hangouts-app');
  this.effectIndex_ = 0;
  this.frame_ = 0;
  this.renderFrameBound_ = this.renderFrame_.bind(this);
  this.frequency_ = 8;
  this.effects_ = new Effects();
  this.tracker_ = new FaceTracker(ccv);
  this.tracker_.init(0, 0, 0, 0);
};

HangoutsPage.prototype = {
  __proto__: AppPage.prototype,
  get isVideoUsing() {
    return !!this.videoSource_;
  }
};

HangoutsPage.prototype.enter = function() {
  AppPage.prototype.enter.call(this);
  navigator.webkitGetUserMedia(
    {video: true},
    function(localMediaStream) {
      if (this.isVideoUsing)
        return;
      // Register the events.
      var doc = this.root.document;
      this.handlers.add(doc.querySelector('.prev-effect'), 'click', function() {
        this.effectIndex_ =
            (this.effectIndex_ + this.effects_.data.length - 1) %
            this.effects_.data.length;
      }.bind(this));
      this.handlers.add(doc.querySelector('.next-effect'), 'click', function() {
        this.effectIndex_ =
            (this.effectIndex_ + this.effects_.data.length + 1) %
            this.effects_.data.length;
      }.bind(this));
      // Initialize the video.
      var URL = this.root.mainWindow_.contentWindow.URL;
      var url = URL.createObjectURL(localMediaStream);
      var videoSource = this.element_.querySelector('.video-source');
      videoSource.src = url;
      videoSource.play();
      this.videoSource_ = videoSource;
      this.mediaStream_ = localMediaStream;
      this.canvas_ = this.element_.querySelector('.video-canvas');
      this.canvasContext_ = this.canvas_.getContext('2d');
      this.effectIndex_ = 0;
      this.frame_ = 0;
      this.track_ = {faces:[]};
      this.effects_.init();
      this.renderFrame_();
    }.bind(this),
    function(err) {
      console.error('Failed to initialize the camera.');
      // Nothing to do when it failed.
    }
  );
};

HangoutsPage.prototype.renderFrame_ = function() {
  if (!this.isVideoUsing)
    return;
  this.canvasContext_.drawImage(
      this.videoSource_, 0, 0, this.canvas_.width, this.canvas_.height);
  var effect = this.effects_.data[this.effectIndex_];
  if (effect.tracks && this.frame_ % this.frequency_ == 0) {
    this.track_ = this.tracker_.track(this.canvas_);
  }
  this.effects_.advance(this.canvas_);
  this.effects_.data[this.effectIndex_].filter(
      this.canvas_, this.canvas_, this.frame_++, this.track_);
  this.root.mainWindow_.contentWindow.requestAnimationFrame(
      this.renderFrameBound_);
};

HangoutsPage.prototype.leave = function() {
  if (!this.videoSource_)
    return;
  this.videoSource_.src = null;
  this.videoSource_ = null;
  this.mediaStream_.stop();
  this.mediaStream_ = null;
  this.effects_.clearBuffer();
  this.canvas_ = null;
  this.canvasContext_ = null;
  this.effectIndex_ = 0;
  this.frame_ = 0;
  this.track_ = null;
  // Due to browser's bug, updating css in this function does not update the
  // view of contents.
  setTimeout(AppPage.prototype.leave.bind(this), 0);
};

var PlayPage = function(root) {
  AppPage.call(this, root, 'play-app');
};

PlayPage.prototype = Object.create(AppPage.prototype, {});

var Root = function() {};

Root.prototype = {
  get document() {
    return this.mainWindow_.contentWindow.document;
  }
};

Root.prototype.init = function() {
  // Register events
  chrome.app.runtime.onLaunched.addListener(this.onLaunched_.bind(this));
  chrome.runtime.onMessageExternal.addListener(this.onMessage_.bind(this));
};

Root.prototype.onLaunched_ = function() {
  this.createMainWindow(MENU_PAGE_INDEX);
};

Root.prototype.onMessage_ = function(req) {
  if (req.name == 'launchDocs')
    this.createMainWindow(DOCS_PAGE_INDEX);
  else if (req.name == 'launchHangouts')
    this.createMainWindow(HANGOUTS_PAGE_INDEX);
  else if (req.name == 'launchPlay')
    this.createMainWindow(PLAY_PAGE_INDEX);
  else if (req.name == 'launchGame')
    this.createMainWindow(GAME_PAGE_INDEX);
};

Root.prototype.createMainWindow = function(pageIndex) {
  var steps = [
    // Create the main window.
    function() {
      var params = {
        id: MAIN_WINDOW_ID,
        hidden: true,
        resizable: false,
        frame: 'none',
        transparentBackground: true
      };
      chrome.app.window.create('main.html', params, steps.shift());
    },

    // Show the main window.
    function(window) {
      if (this.mainWindow_) {
        this.mainWindow_.show();
        this.switchToPage(pageIndex);
        return;
      }
      this.mainWindow_ = window;
      window.setBounds({
        left: 0,
        top: 0,
        width: screen.width,
        height: screen.height
      });
      window.show();
      var doc = window.contentWindow.document;
      if (doc.readyState == "interactive" ||
          doc.readyState == "complete") {
        steps.shift()();
      } else {
        window.contentWindow.addEventListener('load', steps.shift());
      }
    }.bind(this),

    // Initialize pages.
    function() {
      this.pages = [
        new MenuPage(this),
        new DocsPage(this),
        new HangoutsPage(this),
        new PlayPage(this)
      ];
      this.switchToPage(pageIndex);
    }.bind(this)
  ];
  steps.shift()();
};

Root.prototype.switchToPage = function(index) {
  var nextPage = index != GAME_PAGE_INDEX ?
      this.pages[index] : this.pages[MENU_PAGE_INDEX];
  if (this.currentPage != nextPage) {
    if (this.currentPage_)
      this.currentPage_.leave();
    this.currentPage_ = nextPage;
    this.currentPage_.enter();
  }
  if (index == GAME_PAGE_INDEX) {
    chrome.runtime.sendMessage(EXTENSION_HELPER_ID, {name: 'launchGame'});
  }
};

Root.prototype.exit = function() {
  this.mainWindow_.close();
  this.mainWindow_ = null;
  this.pages = null;
};

new Root().init();
