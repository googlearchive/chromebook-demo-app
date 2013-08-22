var LearnMore = function() {
};

LearnMore.PAGES = (function() {
  var buildStringName = function() {
    var id = 'LEARN_MORE_' + Array.prototype.map.call(arguments, function(s) {
      return s.toUpperCase().replace(/[\- ]/g, '_');
    }).join('_');
    return id;
  };

  var makePage = function(id, numSections) {
    var page = {
      id: id,
      title: buildStringName(id, 'title'),
      description: buildStringName(id, 'description'),
      sections: []
    };
    for (var i = 0; i < numSections; i++) {
      page.sections.push({
        title: buildStringName(id, 'section' + (i + 1), 'title'),
        description: buildStringName(id, 'section' + (i + 1), 'description')
      });
    }
    return page;
  };

  return {
    'features': [
      makePage('features-speed', 2),
      makePage('features-apps', 2),
      makePage('features-security', 2)
    ],
    'offline': [makePage('offline', 2)],
    'printing': [makePage('printing', 2)],
    'do-more': [
      makePage('do-more', 2)
    ]
  };
})();

LearnMore.prototype.start = function() {
  // Get page name.
  this.pageName_ = location.search.substr(1) || 'features';

  // Initialize the navigator.
  document.querySelector('#nav a.' + this.pageName_).classList.add('active');

  // Logo
  this.logo_ = new Logo(document.querySelector('#logo'));
  this.logo_.start();

  // Sets the locale.
  this.locale_ = Locale.getAvailableLocale(navigator.language);
  if (this.locale_ != 'en' &&
      this.locale_ != 'en-us')
    document.querySelector('#nav .do-more').style.display = 'none';

  // Dot handler.
  var dotLinks = document.querySelectorAll('#mdn li a');
  for (var i = 0; i < dotLinks.length; i++) {
    dotLinks[i].addEventListener('click', function(i, e) {
      this.updateSubPage_(LearnMore.PAGES[this.pageName_][i]);
      e.preventDefault();
    }.bind(this, i));
  }

  // Set subpage.
  this.updateSubPage_(LearnMore.PAGES[this.pageName_][0]);

  // Load the locale strings.
  Locale.load(this.applyLocale_.bind(this));

  // Remove the loading state.
  document.querySelector('body').classList.remove('loading');
  document.querySelector(
      '#hero-carousel .marquee-carousel').classList.add('active');
};

LearnMore.prototype.updateSubPage_ = function(page) {
  // Dots.
  var numDots = LearnMore.PAGES[this.pageName_].length;
  var dots = document.querySelector('#mdn');
  var pageIndex = LearnMore.PAGES[this.pageName_].indexOf(page);
  if (numDots > 1) {
    dots.style.display = '';
    var dotItems = document.querySelectorAll('#mdn li');
    for (var i = 0; i < dotItems.length; i++) {
      if (i < numDots) {
        if (i == pageIndex)
          dotItems[i].className = 'active tab-on';
        else
          dotItems[i].className = 'active';
      } else {
        dotItems[i].className = '';
      }
    }
  } else {
    dots.style.display = 'none';
  }

  // Main section.
  document.querySelector('#hero-carousel .marquee h1').setAttribute(
      'i18n-content', page.title);
  document.querySelector('#hero-carousel .marquee p').setAttribute(
      'i18n-content', page.description);

  // Cover.
  var covers = document.querySelectorAll('#hero-carousel .marquee .cover');
  for (i = 0; i < covers.length; i++) {
    covers[i].classList.toggle(
        'active', covers[i].classList.contains(page.id));
  }

  // Sub section.
  var num = page.sections.length;
  var items = document.querySelectorAll('#main .g-section > div');
  for (i = 0; i < items.length; i++) {
    if (i < num) {
      items[i].className = 'g-unit g-col-' + ~~(12 / num);
      items[i].querySelector(':-webkit-any(h2, div[class="h2"])').setAttribute(
          'i18n-content', page.sections[i].title);
      items[i].querySelector('p').setAttribute(
          'i18n-content', page.sections[i].description);
      items[i].style.display = '';
    } else {
      items[i].style.display = 'none';
    }
  }

  // Transition animation.
  if (Locale.loaded) {
    document.querySelector(
        '#hero-carousel .marquee-carousel').classList.remove('active');
    setTimeout(function() {
      document.querySelector(
          '#hero-carousel .marquee-carousel').classList.add('active');
    }, 0);
  }

  // Apply locale.
  this.applyLocale_();
};

LearnMore.prototype.applyLocale_ = function() {
  if (!Locale.loaded)
    return;
  Locale.apply(document, this.locale_);
};

new LearnMore().start();