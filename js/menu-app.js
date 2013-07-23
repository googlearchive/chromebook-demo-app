var MENU_PAGE_INDEX = 0;
var DOCS_PAGE_INDEX = 1;
var HANGOUTS_PAGE_INDEX = 2;
var PLAY_PAGE_INDEX = 3;
var GAME_PAGE_INDEX = 4;

var Effects = defined.shift();
var FaceTracker = defined.shift();

var Page = function(root, id) {
  /**
   * @protected
   */
  this.root = root;
  this.element_ = root.document.getElementById(id);
  this.handlers = new HandlerList();
  this.id_ = id;
};

Page.prototype.enter = function() {
  this.element_.setAttribute('active', '');
};

Page.prototype.leave = function() {
  this.handlers.reset();
  this.element_.removeAttribute('active');
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

var PaperEditAdapter = {};

PaperEditAdapter.getTextNodeAt = function(index) {
  var result = document.evaluate(
      './/node()[self::text() or self::br]', this, null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var lastTextNode = null;
  console.log(result.snapshotLength);
  for (var i = 0; i < result.snapshotLength; i++) {
    var textNode = result.snapshotItem(i);
    if (textNode.nodeValue != null) {
      console.log('text node');
      // text node
      lastTextNode = textNode;
      var length = textNode.nodeValue.length;
      if (index < length)
        return {textNode: textNode, subindex: index};
      index -= length;
    } else {
      console.log('br node');
      // br node
      index -= 1;
    }
  }
  return lastTextNode ? {
    textNode: lastTextNode,
    subindex: lastTextNode.length
  } : null;
};

PaperEditAdapter.insertChar = function(index, ch) {
  var nodePos = this.getTextNodeAt(index);
  var text = nodePos.textNode.nodeValue;
  nodePos.textNode.nodeValue =
      text.substr(0, nodePos.subindex) +
      ch +
      text.substr(nodePos.subindex);
};

PaperEditAdapter.deleteChar = function(index) {
  var nodePos = this.getTextNodeAt(index);
  var text = nodePos.textNode.nodeValue;
  nodePos.textNode.nodeValue =
      text.substr(0, nodePos.subindex) +
      text.substr(nodePos.subindex + 1);
};

PaperEditAdapter.getCursorPosition = function(index) {
  var textNodeAt = this.getTextNodeAt(index);
  var textNode = textNodeAt.textNode;
  var dummy = this.ownerDocument.createElement('span');
  var originalText = textNode.nodeValue;
  textNode.nodeValue = originalText.substr(0, textNodeAt.subindex);
  dummy.innerText = ' ';
  var parentNode = textNode.parentNode;
  parentNode.insertBefore(dummy, textNode.nextSibling);
  var paperBounds = this.getBoundingClientRect();
  var bounds = dummy.getBoundingClientRect();
  textNode.nodeValue = originalText;
  parentNode.removeChild(dummy);
  return {
    x: (bounds.left - paperBounds.left),
    y: (bounds.top - paperBounds.top)
  };
};

var DocsPage = function(root) {
  AppPage.call(this, root, 'docs-app');
  this.editors_ = [];
  this.paper_ = extend(this.element_.querySelector('.paper'), PaperEditAdapter);
};

DocsPage.ANIMATION_INTERVAL = 100;

DocsPage.prototype = Object.create(AppPage.prototype, {});

DocsPage.prototype.enter = function() {
  AppPage.prototype.enter.call(this);
  var doc = this.root.document;
  this.cursors_ = this.element_.querySelectorAll('.cursor');

  // Init paper.
  this.paper_.innerText = '';
  this.lastText_ = '';

  this.usedKeyword_ = {};

  // Added first write editor.
  /*
  var editor = new Editor(
      null, null, 'WriteFirst', 'My name is Daichi Hirono.',
      cursors[0]);
  this.editors_.push(editor);
  */

  // Animation event for editors.
  this.handlers.setInterval(
      this.onStep_.bind(this), DocsPage.ANIMATION_INTERVAL);

  // Input event.
  this.handlers.add(this.paper_, 'input', function() {
    // Get difference made by input.
    var diff = calcEditDistance(this.lastText_, this.paper_.innerText, 1, 1, 3);
    this.lastText_ = this.paper_.innerText;
    var indexMap = IndexMap.fromDiff(diff);
    for (var i = 0; i < this.cursors_.length; i++) {
      var cursor = this.cursors_[i];
      if (cursor.editor) {
        var index = cursor.editor.applyIndexMap(indexMap);
        if (index != null) {
          this.setCursorPosition_(cursor, index);
        } else {
          console.log(indexMap);
          cursor.classList.remove('active');
          cursor.classList.add('stop');
          cursor.editor = null;
        }
      }
    }
  }.bind(this));

  // Bold button event.
  var boldButton = this.element_.querySelector('.bold-button');
  this.handlers.add(boldButton, 'click', function() {
    this.root.document.execCommand('bold');
  }.bind(this));
};

DocsPage.prototype.shiftCursors_ = function(index, amount) {
  for (var i = 0; i < this.cursors_.length; i++) {

  }
};

/**
 * Finds the keyword from the paper which can be replaced with the other phrase.
 * @private
 */
DocsPage.prototype.findBotKeyword_ = function() {
  var paperText = this.paper_.innerText;
  for (var i = 0; i < BOT_KEYWORD_MAP.length; i++) {
    for (var keyword in BOT_KEYWORD_MAP[i]) {
      if (this.usedKeyword_[keyword])
        continue;
      var index = paperText.indexOf(' ' + keyword + ' ');
      if (index == -1)
        continue;
      return {
        keyword: keyword,
        index: index + 1,
        result: BOT_KEYWORD_MAP[i][keyword]
      };
    }
  }
  return null;
};

/**
 * The interaval callback function that is called regularly while the Docs.app
 * is open.
 * @private
 */
DocsPage.prototype.onStep_ = function() {
  // Save the selection index.
  var selectionStart = this.paper_.selectionStart;
  var selectionEnd = this.paper_.selectionEnd;

  // Find the editable phrases and adds editors to them.
  var keywordAt = this.findBotKeyword_();
  if (keywordAt) {
    for (var i = 0; i < this.cursors_.length; i++) {
      if (this.cursors_[i].editor)
        continue;
      this.usedKeyword_[keywordAt.keyword] = true;
      this.cursors_[i].editor = new Editor(
          keywordAt.index, keywordAt.keyword, 'Type', keywordAt.result);
      break;
    }
  }

  // Drive the existing editors.
  for (var i = 0; i < this.cursors_.length; i++) {
    var editor = this.cursors_[i].editor;
    if (!editor)
      continue;
    var result = editor.step(null /* Should be the result of diff.
                                     Not implemented yet. */);
    switch (result[0]) {
      case 'ShowCursor':
        this.cursors_[i].classList.add('active');
        break;
      case 'MoveCursor':
        this.setCursorPosition_(this.cursors_[i], result[1]);
        break;
      case 'Insert':
        this.paper_.insertChar(result[1], result[2]);
        this.setCursorPosition_(this.cursors_[i], result[1] + 1);
        this.lastText_ = this.lastText_.substr(0, result[1]) +
                         result[2] +
                         this.lastText_.substr(result[1]);
        break;
      case 'Delete':
        this.paper_.deleteChar(result[1]);
        this.setCursorPosition_(this.cursors_[i], result[1]);
        this.lastText_ = this.lastText_.substr(0, result[1]) +
                         this.lastText_.substr(result[1] + 1);
        break;
      case 'Exit':
        this.cursors_[i].editor = null;
        this.cursors_[i].classList.remove('active');
        break;
    }
  }

  // Restore the selection index.
  this.paper_.selectionStart = selectionStart;
  this.paper_.selectionEnd = selectionEnd;
};

DocsPage.prototype.setCursorPosition_ = function(cursor, index) {
  var pos = this.paper_.getCursorPosition(index);
  cursor.style.left = pos.x + 'px';
  cursor.style.top = pos.y + 'px';
};

DocsPage.prototype.leave = function() {
  AppPage.prototype.leave.call(this);
  this.editors_ = [];
};

var HangoutsPage = function(root) {
  AppPage.call(this, root, 'hangouts-app');
  this.effectIndex_ = 0;
  this.frame_ = 0;
  this.renderFrameBound_ = this.renderFrame_.bind(this);
  this.frequency_ = 8;
  this.effects_ = new Effects();
  Effects.defineAdditionalEffects(this.effects_);
  this.effects_.init();
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
  effect.filter(
      this.canvas_, this.canvas_, this.frame_++, this.track_);
  this.root.mainWindow_.contentWindow.requestAnimationFrame(
      this.renderFrameBound_);
};

HangoutsPage.prototype.leave = function() {
  if (!this.videoSource_)
    return;
  // Reset others.
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
        id: MENU_WINDOW_ID,
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
      if (doc.readyState == 'interactive' ||
          doc.readyState == 'complete') {
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

// new Root().init();

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
      console.log('button clicked');
      var messageName = [
        'launchDocs',
        'launchHangouts',
        'launchPlay',
        'launchGame'
      ][index];
      chrome.runtime.sendMessage(HELPER_EXTENSION_ID, {name: messageName});
    }.bind(this, i));
  }
};

new MenuApp().start();
