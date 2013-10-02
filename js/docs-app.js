var DocsApp = function() {
  App.call(this);
};

DocsApp.ANIMATION_INTERVAL = 100;
DocsApp.STARTUP_WAITING_SECONDS = 14;

DocsApp.prototype = {
  __proto__: App.prototype
};

DocsApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Set padding as the smae size of scroll width.
  var paperContainer = this.get('.paper-scroll-region');
  var scrollSize =
      this.get('#docs-main').clientWidth -
      paperContainer.clientWidth;
  paperContainer.style.paddingLeft = scrollSize + 'px';

  // Obtains the elements.
  this.paper_ = extend(this.get('.paper'), PaperEditAdapter);
  this.cursors_ = this.document.querySelectorAll('.cursor');
  for (var i = 0; i < this.cursors_.length; i++) {
    this.cursors_[i].addEventListener('click', function(cursor) {
      this.paper_.selectionStart = this.paper_.selectionEnd = cursor.index;
    }.bind(this, this.cursors_[i]));
  }

  // Added the start up editing.
  this.cursors_[0].editor =
      new Editor(0, '', Locale.get(this.initialLocale,
                                   'DOCS_STARTING_MESSAGE'));

  // Init variables.
  this.paper_.innerText = '';
  this.editors_ = [];
  this.lastText_ = '';
  this.usedKeyword_ = {};
  this.nextCursorIndex_ = 1;
  this.editingCounter_ = 0;
  this.isStartupWaiting_ =
      DocsApp.STARTUP_WAITING_SECONDS * 1000 / DocsApp.ANIMATION_INTERVAL;

  // Register events.
  this.paper_.addEventListener('input', this.onInput_.bind(this));
  this.paper_.addEventListener('compositionstart', function(e) {
    this.inComposition_ = true;
  }.bind(this));
  this.paper_.addEventListener('compositionend', function(e) {
    this.inComposition_ = false;
  }.bind(this));
  this.intervalID_ = setInterval(
      this.onStep_.bind(this), DocsApp.ANIMATION_INTERVAL);
};

DocsApp.prototype.applyLocale = function(lang) {
  App.prototype.applyLocale.call(this, lang);
  this.keywords_ = null;
  this.loadKeywords_(lang);
};

DocsApp.prototype.updateLayout = function(opt_height) {
  App.prototype.updateLayout.call(this, opt_height);
  var buttonWidth = this.get('.share').getBoundingClientRect().width;
  var balloonWidth = this.get('.share .balloon').getBoundingClientRect().width;
  this.get('#dynamic-styles').innerText +=
      '#docs-app .share .balloon {' +
      '  left: ' + ~~((buttonWidth - balloonWidth) / 2) + 'px;' +
      '}';
};

DocsApp.prototype.loadKeywords_ = function(lang) {
  // Init the keywords.
  this.keywords_ = null;
  // Start loading.
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4)
      return;
    if (xhr.status == 200) {
      var json = JSON.parse(xhr.responseText);
      var keywords = {};
      var keywordsArray = [];
      for (var name in json) {
        var components = name.split('_');
        var id = components[3] + '_' + components[5];
        if (!keywords[id]) {
          keywords[id] = {
            priority: ~~components[3],
            sequence: ~~components[5]
          };
          keywordsArray.push(keywords[id]);
        }
        keywords[id][components[4].toLowerCase()] = json[name].message;
      }
      this.keywords_ = [];
      for (var i = 0; i < keywordsArray.length; i++) {
        this.keywords_[keywordsArray[i].priority] =
            this.keywords_[keywordsArray[i].priority] || [];
        this.keywords_[keywordsArray[i].priority][keywordsArray[i].keyword] =
            keywordsArray[i].result;
      }
    } else if (lang != Locale.DEFAULT) {
      var component = lang.split('_');
      if (component.length == 2)
        this.loadKeywords_(component[0]);
      else
        this.loadKeywords_(Locale.DEFAULT);
    }
  }.bind(this);
  xhr.open('GET', 'words_' + lang + '.json');
  xhr.send();
};

DocsApp.prototype.onInput_ = function(e) {
  // Get difference made by input.
  var indexMap = calcSimpleIndexMap(this.lastText_, this.paper_.value);
  this.lastText_ = this.paper_.value;
  this.updateCursorPosition_(indexMap);

  // Cancel startup waiting.
  this.isStartupWaiting_ = 0;
};

/**
 * The interaval callback function that is called regularly while the Docs.app
 * is open.
 * @private
 */
DocsApp.prototype.onStep_ = function() {
  if (this.inComposition_)
    return;
  // Find the editable phrases and adds editors to them.
  if (this.editingCounter_ > 0 || this.isStartupWaiting_ > 0) {
    this.editingCounter_--;
    this.isStartupWaiting_--;
  } else {
    var keywordAt = this.findBotKeyword_();
    if (keywordAt) {
      // Check if no other editors are editing around the keyword.
      var conflict = false;
      for (var j = 0; j < this.cursors_.length; j++) {
        var editor = this.cursors_[j].editor;
        if (!editor)
          continue;
        if (!(keywordAt.index + keywordAt.keyword.length < editor.index ||
              editor.index + editor.length < keywordAt.index)) {
          keywordAt = null;
          break;
        }
      }
    }
    if (keywordAt) {
      for (var i = 0; i < this.cursors_.length; i++) {
        var cursor = this.cursors_[
            (i + this.nextCursorIndex_) % this.cursors_.length];
        if (cursor.editor)
          continue;
        this.usedKeyword_[keywordAt.keyword] = true;
        cursor.editor = new Editor(
            keywordAt.index, keywordAt.keyword, keywordAt.result);
        this.nextCursorIndex_++;
        this.editingCounter_ = ~~(Math.random() * 100);
        break;
      }
    }
  }

  // Drive the existing editors.
  for (var i = 0; i < this.cursors_.length; i++) {
    var editor = this.cursors_[i].editor;
    if (!editor) {
      if (this.cursors_[i].index === 0)
        this.cursors_[i].classList.remove('active', 'typing');
      continue;
    }
    var selectionStart = this.paper_.selectionStart;
    var selectionEnd = this.paper_.selectionEnd;
    var command = editor.step();
    switch (command.name) {
      case 'HideCursor':
        this.cursors_[i].classList.remove('active', 'typing');
        break;
      case 'ShowCursor':
        this.cursors_[i].classList.add('active', 'typing');
        break;
      case 'Insert':
        this.paper_.insertChar(command.index, command.ch);
        this.lastText_ = this.paper_.value;
        break;
      case 'Delete':
        this.paper_.deleteChar(command.index);
        this.lastText_ = this.paper_.value;
        break;
      case 'Exit':
        this.cursors_[i].classList.remove('typing');
        this.cursors_[i].editor = null;
        break;
    }

    if (typeof command.cursorIndex == 'number')
      this.setCursorPosition_(this.cursors_[i], command.cursorIndex);

    var indexMap = IndexMap.fromCommand(command);
    if (indexMap)
      this.updateCursorPosition_(indexMap, editor,
                                 selectionStart, selectionEnd);
  }
};

/**
 * Update the cursors position on the paper.
 *
 * @param {IndexMap} indexMap Index map used to obtain the new cursor
 *     position.
 * @param {Editor} editor Editor that create the change. It should be null if
 *     the change is created by a user.
 * @param {number?} selectionStart Original selection start position on the
 *     paper. It should be null if the change is created by a user.
 * @param {number?} selectionEnd Original selection end position on the paper.
 *     It should be null if the change is created by a user.
 */
DocsApp.prototype.updateCursorPosition_ =
    function(indexMap, editor, selectionStart, selectionEnd) {
  // Update the real cursor.
  if (selectionStart != null)
    this.paper_.selectionStart = indexMap.map(selectionStart);
  if (selectionEnd != null)
    this.paper_.selectionEnd = indexMap.map(selectionEnd);

  // Update the fake cursors and editros.
  for (var i = 0; i < this.cursors_.length; i++) {
    var cursor = this.cursors_[i];
    if (cursor.editor) {
      if (cursor.editor == editor)
        continue;
      cursor.editor.applyIndexMap(indexMap);
    }
    if (typeof cursor.index == 'number') {
      if (cursor.editor) {
        this.setCursorPosition_(cursor, indexMap.map(cursor.index));
        continue;
      }
      if (cursor.index == 0)
        continue;
      var nextBackIndex = indexMap.map(cursor.index - 1);
      if (indexMap.isDeleted(cursor.index - 1))
        this.setCursorPosition_(cursor, nextBackIndex);
      else
        this.setCursorPosition_(cursor, nextBackIndex + 1);
    }
  }
};

/**
 * Finds the keyword from the paper which can be replaced with the other phrase.
 * @private
 */
DocsApp.prototype.findBotKeyword_ = function() {
  // If the keywords haven't loaded yet, just returns null.
  if (!this.keywords_)
    return null;
  var paperText = this.paper_.value;
  for (var i = 0; i < this.keywords_.length; i++) {
    for (var keyword in this.keywords_[i]) {
        console.debug(keyword);
      if (this.usedKeyword_[keyword])
        continue;
      // Make regexp to search the word.
      var expression = keyword.replace(
          /[\[\]\.\+\*\(\)\?\\\^\$]/g, function(ch) { return "\\" + ch;  });
      var regexp =
        new RegExp('(?:^|\\s)(' + expression + ')(?=\\s|[\.\,\!\?\:])');
      var result = regexp.exec(paperText);
      if (!result)
        continue;
      var index = paperText.indexOf(keyword, result.index);
      if (index == -1)
        continue;
      return {
        keyword: keyword,
        index: index,
        result: this.keywords_[i][keyword]
      };
    }
  }
  return null;
};

DocsApp.prototype.setCursorPosition_ = function(cursor, index) {
  if (this.lastText_.length < index) {
    console.error('Invalid set cursor.');
  }
  cursor.index = index;
  var text = this.paper_.value.substr(0, index);
  var measureText = this.get('.measure-text');
  measureText.innerText = text;
  var measureCursor = this.get('.measure-cursor');
  var paperBounds = this.paper_.getBoundingClientRect();
  var bounds = measureCursor.getBoundingClientRect();
  cursor.style.left = (bounds.left - paperBounds.left) + 'px';
  cursor.style.top = (bounds.top - paperBounds.top) + 'px';
};

DocsApp.prototype.close = function() {
  if (this.intervalID_) {
    clearInterval(this.intervalID_);
    this.intervalID_ = null;
  }
  App.prototype.close.call(this);
};

new DocsApp().start();
