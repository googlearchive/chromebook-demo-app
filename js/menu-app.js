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

  // Update the CSS class.
  var appFrame = this.get('.app-frame');
  if (Component.ENTRIES.Menu.windowParams.transparentBackground)
    appFrame.classList.add('transparent');
  appFrame.classList.remove('loading');

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
  this.get('.learn-more').addEventListener('click', function() {
    Component.ENTRIES.Helper.sendMessage({name: 'visitLearnMore'});
  });

  // Language picker.
  var languagePicker = this.get('.language-picker');
  languagePicker.addEventListener('mousedown', function() {
    languagePicker.classList.add('open');
  });
  languagePicker.addEventListener('mouseup', function(event) {
    event.stopPropagation();
    if (event.target.nodeName == 'LI') {
      languagePicker.classList.remove('open');
      var code = event.target.getAttribute('data-i18n-code');
      this.applyLocale(code);
      var components = [
        Component.ENTRIES.Menu,
        Component.ENTRIES.Docs,
        Component.ENTRIES.Hangouts,
        Component.ENTRIES.Music,
        Component.ENTRIES.Store,
        Component.ENTRIES.Helper
      ];
      for (var i = 0; i < components.length; i++) {
        components[i].sendMessage({name: 'applyLocale', code: code});
      }
    }
  }.bind(this));
  this.document.addEventListener('mouseup', function() {
    languagePicker.classList.remove('open');
  });
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
  this.get('.language-picker label').innerText =
      Locale.get(locale, 'LANGUAGE_NAME_' + locale.toUpperCase());
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
    '.third.button',
    '.store.button'
  ];
  var step = ~~(this.rotationCounter_ / 2) - 5;
  var target = step < 0 || (step % 5) >= 3 ? -1 : ~~(step / 5) % buttons.length;
  for (var i = 0; i < buttons.length; i++) {
    this.get(buttons[i]).classList.toggle('rotated', target == i);
  }
  this.rotationCounter_ = this.inHover_ ? 0 : this.rotationCounter_ + 1;
};

new MenuApp().start();
