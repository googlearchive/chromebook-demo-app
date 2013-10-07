var LANGUAGE_PICKER_CLIENT_IDS = Object.freeze([
  Component.ENTRIES.Docs.id,
  Component.ENTRIES.Hangouts.id,
  Component.ENTRIES.Music.id,
  Component.ENTRIES.Store.id,
  Component.ENTRIES.Helper.id,
  'bjdhhokmhgelphffoafoejjmlfblpdha',
  'kkkbcoabfhgekpnddfkaphobhinociem',
  'kgimkbnclbekdkabkpjhpakhhalfanda',
  'pbdihpaifchmclcmkfdgffnnpfbobefh',
  'cdjikkcakjcdjemakobkmijmikhkegcj',
  'hdmobeajeoanbanmdlabnbnlopepchip',
  'fgjnkhlabjcaajddbaenilcmpcidahll',
  'ebkhfdfghngbimnpgelagnfacdafhaba',
  'nifkmgcdokhkjghdlgflonppnefddien',
  'diehajhcjifpahdplfdkhiboknagmfii',
  'mdhnphfgagkpdhndljccoackjjhghlif',
  'adlphlfdhhjenpgimjochcpelbijkich',
  'cgmlfbhkckbedohgdepgbkflommbfkep',
  'iddohohhpmajlkbejjjcfednjnhlnenk',
  'piahpgmnafifnloeaipmchljlfamnmmf',
  'mdelndfaabnbpmglgekmkmenagdlbjoh',
  'fpgfohogebplgnamlafljlcidjedbdeb',
  'ehcabepphndocfmgbdkbjibfodelmpbb',
  'hfhhnacclhffhdffklopdkcgdhifgngh',
  'npnjdccdffhdndcbeappiamcehbhjibf',
  'joodangkbfjnajiiifokapkpmhfnpleo'
]);

var LanguagePicker = function(element, selectCallback) {
  this.element_ = element;
  this.selectCallback_ = selectCallback;
  Object.freeze(this);

  element.addEventListener('mousedown', this.onMouseDown_.bind(this));
  element.addEventListener('keydown', this.onKeyDown_.bind(this));
  element.addEventListener('mouseover', this.onMouseOver_.bind(this));
  element.addEventListener('mouseout', this.onMouseOut_.bind(this));
  element.addEventListener('mousemove', this.onMouseMove_.bind(this));
  element.addEventListener('mouseup', this.onMouseUp_.bind(this));
  element.ownerDocument.addEventListener('mouseup',
                                         this.onGlobalMouseUp_.bind(this));
};

LanguagePicker.prototype = {
  get items_() {
    return this.element_.querySelectorAll('li');
  },
  get opened_() {
    return this.element_.classList.contains('open');
  },
  get selectedIndex_() {
    var items = this.items_;
    var selected = this.element_.querySelector('li.selected');
    for (var i = 0; i < items.length; i++)
      if (items[i] == selected)
        return i;
    return -1;
  }
};

LanguagePicker.prototype.onMouseDown_ = function(event) {
  if (event.target.nodeName == 'LABEL')
    this.element_.classList.toggle('open');
};

LanguagePicker.prototype.onMouseOver_ = function() {
  this.element_.focus();
};

LanguagePicker.prototype.onMouseOut_ = function(event) {
  if (!this.opened_)
    this.element_.blur();
};

LanguagePicker.prototype.onMouseUp_ = function(event) {
  event.stopPropagation();
  if (event.target.nodeName == 'LI')
    this.commit_();
};

LanguagePicker.prototype.onGlobalMouseUp_ = function(event) {
  this.element_.classList.remove('open');
};

LanguagePicker.prototype.onMouseMove_ = function(event) {
  if (event.target.nodeName == 'LI') {
    var items = this.items_;
    for (var i = 0; i < items.length; i++)
      if (items[i] == event.target)
        this.select_(i);
  }
};

LanguagePicker.prototype.onKeyDown_ = function(event) {
  switch (event.keyCode) {
    case 13: /* Enter */
      if (this.opened_)
        this.commit_();
      else
        this.open_();
      break;

    case 27: /* ESC */
      if (this.isOpened_()) {
        this.close_();
        event.stopPropagation();
      }
      break;

    case 38: /* Up */
    case 40: /* Down */
      if (!this.element_.classList.contains('open') &
          event.keyCode == 38) {
        this.open_();
      } else {
        var delta = event.keyCode == 38 ? -1 : 1;
        var index = this.selectedIndex_;
        this.select_(Math.max(0, Math.min(index + delta,
                                          this.items_.length - 1)));
      }
      break;

    case 9: /* Tab */
      this.element_.classList.remove('open');
      break;
  }
};

LanguagePicker.prototype.isOpened_ = function() {
  return this.element_.classList.contains('open');
};

LanguagePicker.prototype.open_ = function() {
  this.element_.classList.add('open');
  this.select_(0);
};

LanguagePicker.prototype.close_ = function() {
  this.element_.classList.remove('open');
};

LanguagePicker.prototype.select_ = function(index) {
  var items = this.items_;
  for (var i = 0; i < items.length; i++)
    items[i].classList.toggle('selected', i == index);
};

LanguagePicker.prototype.commit_ = function() {
  this.close_();
  this.selectCallback_(
      this.items_[this.selectedIndex_].getAttribute('data-i18n-code'));
};

var MenuApp = function() {
  App.call(this);
};

MenuApp.prototype = {
  __proto__: App.prototype
};

MenuApp.prototype.start = function() {
  App.prototype.start.call(this);
};

MenuApp.prototype.initDocument = function() {
  App.prototype.initDocument.call(this);

  // Init rotation.
  this.inHover_ = 0;
  this.rotationCounter_ = 0;
  this.rotationID_ = setInterval(this.onStep_.bind(this), 500);
  this.onStep_();

  // Init document.
  var appFrame = this.get('.app-frame');
  if (Component.ENTRIES.Menu.windowParams.transparentBackground)
    appFrame.classList.add('transparent');
  appFrame.classList.remove('loading');
  document.addEventListener('keydown', this.onKeyDown_.bind(this));

  // Logo
  this.logo_ = new Logo(this.get('.logo'));
  this.logo_.start();

  // Child application buttons.
  var buttons = this.document.querySelectorAll('.button');
  for (var i = 0; i < buttons.length; i++) {
    // Click - launch the child applications.
    buttons[i].addEventListener('click', function(index) {
      var id = [
        Component.ENTRIES.Docs.id,
        Component.ENTRIES.Hangouts.id,
        buttons[2].id,
        Component.ENTRIES.Store.id
      ][index];
      Component.ENTRIES.Helper.sendMessage({name: 'launch', id: id});
    }.bind(this, i));

    // Hover - reset rotation counter.
    buttons[i].addEventListener('mouseover', this.onHover_.bind(this, true));
    buttons[i].addEventListener('mouseout', this.onHover_.bind(this, false));
  }

  // Learn more link.
  var learnMore = this.get('.learn-more');
  learnMore.addEventListener('click', function() {
    Component.ENTRIES.Helper.sendMessage({name: 'visitLearnMore'});
  });
  learnMore.addEventListener('mouseover', function() {
    learnMore.focus();
    this.rotationCounter_ = 0;
  }.bind(this));
  learnMore.addEventListener('mouseout', function() { learnMore.blur(); });

  // Language picker.
  var LanguagePickerElement = this.get('.language-picker');
  var languagePicker = new LanguagePicker(
      LanguagePickerElement,
      function(code) {
        this.applyLocale(code);
        for (var i = 0; i < LANGUAGE_PICKER_CLIENT_IDS.length; i++) {
          chrome.runtime.sendMessage(
              LANGUAGE_PICKER_CLIENT_IDS[i], {name: 'applyLocale', code: code});
        }
      }.bind(this));
  LanguagePickerElement.addEventListener('focus', function() {
    this.rotationCounter_ = 0;
  }.bind(this));
};

MenuApp.prototype.applyLocale = function(locale) {
  App.prototype.applyLocale.call(this, locale);
  var buttonType = Locale.get(locale, 'MENU_THIRD_BUTTON_TYPE');

  // Update the third button.
  var appFrame = this.get('.app-frame');
  var button = this.get('.button.third');
  switch (buttonType) {
    case 'play':
      appFrame.classList.add('play');
      appFrame.classList.remove('youtube');
      button.querySelector('.button-label').innerText =
          Locale.get(locale, 'MENU_MUSIC_BUTTON');
      button.id = Component.ENTRIES.Music.id;
      break;
    case 'youtube':
      appFrame.classList.add('youtube');
      appFrame.classList.remove('play');
      button.querySelector('.button-label').innerText =
          Locale.get(locale, 'MENU_YOUTUBE_BUTTON');
      button.id = 'pbdihpaifchmclcmkfdgffnnpfbobefh' /* Youtube app ID */;
      break;
    default:
      console.error('Invalid variation.', Component.ENTRIES.Menu.variation);
      break;
  }

  // Language picker
  this.get('.language-picker label').innerText = Locale.get(
      locale, 'LANGUAGE_NAME_' + locale.toUpperCase().replace(/-/g, '_'));
};

MenuApp.prototype.close = function() {
  if (this.rotationID_) {
    clearInterval(this.rotationID_);
    this.rotationID_ = null;
  }
  App.prototype.close.call(this);
};

MenuApp.prototype.onHover_ = function(f, event) {
  // Rotation.
  this.inHover_ = f;
  this.rotationCounter_ = 0;
  this.onStep_();

  // Focus.
  if (f)
    event.target.focus();
  else
    event.target.blur();
};

MenuApp.prototype.onFocus_ = function() {
  this.rotationCounter_ = 0;
  this.onStep_();
};

MenuApp.prototype.onStep_ = function() {
  // Rotate the highlight bars.
  var buttons = [
    '.docs.button',
    '.hangouts.button',
    '.third.button',
    '.store.button'
  ];
  var step = ~~(this.rotationCounter_ / 2) - 5;
  var target = step < 0 || (step % 5) >= 3 ? -1 : ~~(step / 5) % buttons.length;
  if (target != -1) {
    this.get(buttons[target]).focus();
  }
  this.rotationCounter_ = this.inHover_ ? 0 : this.rotationCounter_ + 1;
};

MenuApp.prototype.onKeyDown_ = function(event) {
  if (event.keyCode == 9) {
    this.rotationCounter_ = 0;
    this.onStep_();
  }
};

new MenuApp().start();
