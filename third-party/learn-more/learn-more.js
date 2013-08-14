var pageName = location.search.substr(1) || 'features';

/**
 * You can get the list of ID from the development tools's inspector.
 *
 * @example
 * ID_LIST.join("\n");
 */
var ID_LIST = [];

var buildStringName = function() {
  var id = 'LEARN_MORE_' + Array.prototype.map.call(arguments, function(s) {
    return s.toUpperCase().replace(/[\- ]/g, '_');
  }).join('_');
  ID_LIST.push(id);
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

var PAGES = {
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

// Page contents
var layouts;
switch (pageName) {
  case 'features':
    layouts = [2, 3, 3];
    break;
  case 'do-more':
    layouts = [2, 2];
    break;
  default:
    layouts = [0];
    break;
}

var items = document.querySelectorAll('#hero-carousel .marquee');
for (var i = 0; i < items.length; i++) {
  if (i < layouts.length) {
    items[i].querySelector('h1').innerText = 'TITLE';
    items[i].querySelector('p').innerText = 'DESCRIPTION';
  } else {
    items[i].style.display = 'none';
  }
}

Locale.load(function() {

Locale.apply(document, 'en');

var getLocale = function(id) {
  return Locale.get('en', id);
};

var updateSubPage = function(page) {
  var i;
  // Main section
  document.querySelector('#hero-carousel .marquee h1').innerText =
      getLocale(page.title);
  document.querySelector('#hero-carousel .marquee p').innerText =
      getLocale(page.description);

  // Cover
  var covers = document.querySelectorAll('#hero-carousel .marquee .cover');
  for (i = 0; i < covers.length; i++) {
    covers[i].classList.toggle(
        'active', covers[i].classList.contains(page.id));
  }

  // Sub section
  var num = page.sections.length;
  var items = document.querySelectorAll('#main .g-section > div');
  for (i = 0; i < items.length; i++) {
    if (i < num) {
      items[i].className = 'g-unit g-col-' + ~~(12 / num);
      items[i].querySelector(':-webkit-any(h2, div[class="h2"])').innerText =
          getLocale(page.sections[i].title);
      items[i].querySelector('p').innerText =
          getLocale(page.sections[i].description);
      items[i].style.display = '';
    } else {
      items[i].style.display = 'none';
    }
  }

  // Animation
  document.querySelector(
      '#hero-carousel .marquee-carousel').classList.remove('active');
  setTimeout(function() {
    document.querySelector(
        '#hero-carousel .marquee-carousel').classList.add('active');
  }, 0);
};

updateSubPage(PAGES[pageName][0]);

// Dots
var numDots = PAGES[pageName].length;
var dots = document.querySelector('#mdn');
if (numDots > 1) {
  var dotItems = document.querySelectorAll('#mdn li');
  for (var i = 0; i < dotItems.length; i++) {
    if (i < numDots) {
      var dotLink = dotItems[i].querySelector('a');
      dotLink.addEventListener('click', function(i, e) {
        updateSubPage(PAGES[pageName][i]);
        e.preventDefault();
      }.bind(null, i));
    } else {
      dotItems[i].style.display = 'none';
    }
  }
} else {
  dots.style.display = 'none';
}

// Navigator
document.querySelector('#nav li.' + pageName).classList.add('active');
var menubar=new chrm.ui.MenuBar;
menubar.decorate("nav");

// Logo
new chrm.ui.Logo("logo");

document.querySelector('#main').classList.remove('loading');
document.querySelector('.marquee-carousel').classList.add('active');
});
