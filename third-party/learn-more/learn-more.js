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

var LOCALES = {
  "LEARN_MORE_FEATURES_SPEED_TITLE": {
    "message": "Ready when you are",
    "description": ""
  },
  "LEARN_MORE_FEATURES_SPEED_DESCRIPTION": {
    "message": "Chromebook starts in seconds, so you can go straight to playing, enjoying or working (if you have to).",
    "description": ""
  },
  "LEARN_MORE_FEATURES_SPEED_SECTION1_TITLE": {
    "message": "Starts fast, stays fast",
    "description": ""
  },
  "LEARN_MORE_FEATURES_SPEED_SECTION1_DESCRIPTION": {
    "message": "Chromebook boots up in less than 10 seconds, and unlike other computers, doesn’t slow down over time.",
    "description": ""
  },
  "LEARN_MORE_FEATURES_SPEED_SECTION2_TITLE": {
    message: "Browse faster",
    description: ""
  },
  "LEARN_MORE_FEATURES_SPEED_SECTION2_DESCRIPTION": {
    message: "With features like Chrome Instant built-in, browse the web at lightning speed.",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_TITLE": {
    message: "Less #$%!, more :)",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_DESCRIPTION": {
    message: "Chromebook has apps built in, so it works right out of the box.",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_SECTION1_TITLE": {
    message: "No complicated software",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_SECTION1_DESCRIPTION": {
    message: "Docs, Hangouts and Play Music come free with your Chromebook. Add new apps directly from the Chrome Web Store.",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_SECTION2_TITLE": {
    message: "Stays fresh by itself",
    description: ""
  },
  "LEARN_MORE_FEATURES_APPS_SECTION2_DESCRIPTION": {
    message: "Chromebook updates itself automatically so there’s no annoying pop-ups.",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_TITLE": {
    message: "Gives you peace of mind",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_DESCRIPTION": {
    message: "Virus protection is built in, and your files are safely backed up online.",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_SECTION1_TITLE": {
    message: "Multiple layers of security",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_SECTION1_DESCRIPTION": {
    message: "Virus protection and other security features keep you safe from viruses, malware and other computer nasties.",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_SECTION2_TITLE": {
    message: "Keeps your files safe",
    description: ""
  },
  "LEARN_MORE_FEATURES_SECURITY_SECTION2_DESCRIPTION": {
    message: "With Google Drive, an online file storage service, you can backup your files and access them from anywhere.",
    description: ""
  },
  "LEARN_MORE_OFFLINE_TITLE": {
    message: "Works offline",
    description: ""
  },
  "LEARN_MORE_OFFLINE_DESCRIPTION": {
    message: "Chromebook helps you get stuff done even if you are not connected to the web.",
    description: ""
  },
  "LEARN_MORE_OFFLINE_SECTION1_TITLE": {
    message: "Your favorite apps built-in",
    description: ""
  },
  "LEARN_MORE_OFFLINE_SECTION1_DESCRIPTION": {
    message: "Apps like Google Docs, Offline Gmail, a media player and a photo editor keep you productive on the go.",
    description: ""
  },
  "LEARN_MORE_OFFLINE_SECTION2_TITLE": {
    message: "Get more in the Chrome Web Store",
    description: ""
  },
  "LEARN_MORE_OFFLINE_SECTION2_DESCRIPTION": {
    message: "You can find many more free offline apps in the Chrome Web Store.",
    description: ""
  },
  "LEARN_MORE_PRINTING_TITLE": {
    message: "Print without cords",
    description: ""
  },
  "LEARN_MORE_PRINTING_DESCRIPTION": {
    message: "Your Chromebook can print wirelessly to any cloud-connected printer.",
    description: ""
  },
  "LEARN_MORE_PRINTING_SECTION1_TITLE": {
    message: "Google Cloud Print",
    description: ""
  },
  "LEARN_MORE_PRINTING_SECTION1_DESCRIPTION": {
    message: "Cloud Print runs over the web so your Chromebook can print whether you’re in the same room as your printer, or on the go.",
    description: ""
  },
  "LEARN_MORE_PRINTING_SECTION2_TITLE": {
    message: "Works with conventional printers",
    description: ""
  },
  "LEARN_MORE_PRINTING_SECTION2_DESCRIPTION": {
    message: "Cloud Ready printers work right out of the box, but if you own a PC or Mac and a conventional printer, you can connect it to work with your Chromebook.",
    description: ""
  },

  "LEARN_MORE_DO_MORE_TITLE": {
    message: "Chromecast",
    description: ""
  },
  "LEARN_MORE_DO_MORE_DESCRIPTION": {
    message: "Send your favorite online entertainment from your Chromebook to your TV. For $35.",
    description: ""
  },
  "LEARN_MORE_DO_MORE_SECTION1_TITLE": {
    message: "Sit back, watch together",
    description: ""
  },
  "LEARN_MORE_DO_MORE_SECTION1_DESCRIPTION": {
    message: "Enjoy online movies, music, and more on your TV.",
    description: ""
  },
  "LEARN_MORE_DO_MORE_SECTION2_TITLE": {
    message: "Cast the web to your TV",
    description: ""
  },
  "LEARN_MORE_DO_MORE_SECTION2_DESCRIPTION": {
    message: "Cast a Chrome browser tab from your Chromebook to your TV at home (beta).",
    description: ""
  }
};

var getLocale = function(id) {
  var placeHolder = '[Place holder]';
  if (LOCALES[id] && LOCALES[id].message)
    return LOCALES[id].message;
  else
    return placeHolder;
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

// var carousel=new chrm.ui.TimedCarousel({"tabContainerClass":"dot-tabs","carouselId":"main","isTimerSet":true,"timerDuration":4E3,"loop":false});