CHROME=/opt/google/chrome/chrome

TARGETS = menu docs hangouts music store helper

MENU_FILES = \
  js/app.js \
  js/menu-app.js \
  js/background.js \
  js/util.js \
  js/downloader.js \
  css/common.css \
  css/menu-app.css \
  assets/menu-icon-16.png \
  assets/menu-icon-48.png \
  assets/menu-icon-128.png \
  assets/menu-logo-1x.png \
  assets/menu-logo-2x.png \
  assets/docs-icon-64.png \
  assets/hangouts-icon-64.png \
  assets/music-icon-64.png \
  assets/store-icon-64.png \
  assets/docs-icon-128.png \
  assets/hangouts-icon-128.png \
  assets/music-icon-128.png \
  assets/store-icon-128.png \
  assets/close-1x.png \
  assets/close-2x.png \
  views/menu-app.html \
  views/downloader.html \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  "third-party/sample-files/1995 Field Notes.docx" \
  third-party/sample-files/Arches.png \
  "third-party/sample-files/Chromebook Backup.mov" \
  third-party/sample-files/Night.png \
  third-party/sample-files/Song.mp3

DOCS_FILES = \
  assets/balloon-triangle-top-1x.png \
  assets/balloon-triangle-top-2x.png \
  assets/close-1x.png \
  assets/close-2x.png \
  assets/docs-icon-128.png \
  assets/docs-icon-32.png \
  assets/docs-icon-48.png \
  assets/docs-icon-64.png \
  assets/docs-icon-96.png \
  assets/docs-ruler-2x.png \
  assets/docs-section-anywhere-1x.png \
  assets/docs-section-anywhere-2x.png \
  assets/docs-section-backup-1x.png \
  assets/docs-section-backup-2x.png \
  assets/docs-section-group-1x.png \
  assets/docs-section-group-2x.png \
  assets/docs-share-2x.png \
  assets/docs-toolbar-2x.png \
  assets/docs-user-charles-2x.png \
  assets/docs-user-edgar-2x.png \
  assets/docs-user-fredrick-2x.png \
  css/common.css \
  css/docs-app.css \
  js/app.js \
  js/background.js \
  js/docs-app.js \
  js/edit-distance.js \
  js/editor.js \
  js/paper-edit-adapter.js \
  js/util.js \
  third-party/docs-bot-words/words.js \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  views/docs-app.html

HANGOUTS_FILES = \
  assets/balloon-triangle-bottom-1x.png \
  assets/balloon-triangle-bottom-2x.png \
  assets/balloon-triangle-top-1x.png \
  assets/balloon-triangle-top-2x.png \
  assets/close-1x.png \
  assets/close-2x.png \
  assets/glasses.png \
  assets/hangouts-button-add-2x.png \
  assets/hangouts-button-effects-2x.png \
  assets/hangouts-button-invite-2x.png \
  assets/hangouts-button-screenshare-2x.png \
  assets/hangouts-icon-128.png \
  assets/hangouts-icon-32.png \
  assets/hangouts-icon-48.png \
  assets/hangouts-icon-64.png \
  assets/hangouts-icon-96.png \
  assets/hangouts-section-fun-1x.png \
  assets/hangouts-section-fun-2x.png \
  assets/hangouts-section-group-1x.png \
  assets/hangouts-section-group-2x.png \
  assets/hangouts-section-nohassle-1x.png \
  assets/hangouts-section-nohassle-2x.png \
  assets/hangouts-people-robertdo.png \
  assets/hangouts-people-erican.png \
  assets/hangouts-people-mikefox.png \
  assets/hangouts-people-nicholasritz.png \
  css/common.css \
  css/hangouts-app.css \
  gen/third-party/effects.js \
  gen/third-party/glfx.js \
  gen/third-party/track.js \
  js/app.js \
  js/background.js \
  js/effects-helper.js \
  js/hangouts-app.js \
  js/util.js \
  third-party/ccv/js/ccv.js \
  third-party/ccv/js/face.js \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  views/hangouts-app.html

MUSIC_FILES = \
  assets/balloon-triangle-left-1x.png \
  assets/balloon-triangle-left-2x.png \
  assets/balloon-triangle-right-1x.png \
  assets/balloon-triangle-right-2x.png \
  assets/close-1x.png \
  assets/close-2x.png \
  assets/music-equalizer-2x.gif \
  assets/music-icon-128.png \
  assets/music-icon-32.png \
  assets/music-icon-48.png \
  assets/music-icon-64.png \
  assets/music-icon-96.png \
  assets/music-pause-control-2x.png \
  assets/music-play-control-2x.png \
  assets/music-section-anywhere-1x.png \
  assets/music-section-anywhere-2x.png \
  assets/music-section-unlimited-1x.png \
  assets/music-section-unlimited-2x.png \
  assets/music-section-upload-1x.png \
  assets/music-section-upload-2x.png \
  css/common.css \
  css/music-app.css \
  js/app.js \
  js/background.js \
  js/music-app.js \
  js/util.js \
  third-party/music/music-lumineers.mp3 \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/roboto/Roboto-Light.ttf \
  third-party/roboto/Roboto-ThinItalic.ttf \
  third-party/music-covers/music-cover-lumineers.jpg \
  third-party/music-covers/music-cover-maroon5.jpg \
  third-party/music-covers/music-cover-florence.jpg \
  third-party/music-covers/music-cover-blake-shelton.jpg \
  third-party/music-covers/music-cover-tiesto.jpg \
  third-party/music-covers/music-cover-mika.jpg \
  third-party/music-covers/music-cover-one-republic.jpg \
  third-party/music-covers/music-cover-muse.png \
  third-party/music-covers/music-cover-frank-ocean.jpg \
  third-party/music-covers/music-cover-imagine-dragons.jpg \
  third-party/music-covers/music-cover-the-doors.tif \
  third-party/music-covers/music-cover-tegan-and-sara.png \
  third-party/music-covers/music-cover-ellie-goulding.jpg \
  views/music-app.html

STORE_FILES= \
  assets/close-1x.png \
  assets/close-2x.png \
  assets/store-icon-128.png \
  assets/store-icon-32.png \
  assets/store-icon-48.png \
  assets/store-icon-64.png \
  assets/store-icon-96.png \
  assets/store-section-install-1x.png \
  assets/store-section-install-2x.png \
  assets/store-section-stability-1x.png \
  assets/store-section-stability-2x.png \
  assets/store-section-thousands-1x.png \
  assets/store-section-thousands-2x.png \
  assets/store-star-black.png \
  assets/store-star-half.png \
  assets/store-star-white.png \
  css/common.css \
  css/store-app.css \
  js/app.js \
  js/background.js \
  js/store-app.js \
  js/util.js \
  third-party/app-tiles/store-tile-bejeweled.png \
  third-party/app-tiles/store-tile-cubeslam.png \
  third-party/app-tiles/store-tile-deezer.png \
  third-party/app-tiles/store-tile-gmail.png \
  third-party/app-tiles/store-tile-kindle.png \
  third-party/app-tiles/store-tile-netflix.png \
  third-party/app-tiles/store-tile-pandora.jpg \
  third-party/app-tiles/store-tile-pixlr.png \
  third-party/app-tiles/store-tile-plus.png \
  third-party/app-tiles/store-tile-remotedesktop.png \
  third-party/app-tiles/store-tile-sheets.png \
  third-party/app-tiles/store-tile-slides.png \
  third-party/app-tiles/store-tile-spotify.png \
  third-party/app-tiles/store-tile-tweetdeck.png \
  third-party/app-tiles/store-tile-youtube.png \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  views/store-app.html

HELPER_FILES= \
  js/helper-extension.js \
  js/util.js \
  views/learn-more.html \
  third-party/platform-analytics/google-analytics-bundle.js

packages: third-party
	for x in ${TARGETS}; \
	  do mkdir -p packages/demo-$$x; \
	  cp manifests/$$x-manifest.json packages/demo-$$x/manifest.json; \
	done
	cp ${MENU_FILES} packages/demo-menu
	cp ${DOCS_FILES} packages/demo-docs
	cp ${HANGOUTS_FILES} packages/demo-hangouts
	cp ${MUSIC_FILES} packages/demo-music
	cp ${STORE_FILES} packages/demo-store
	cp ${HELPER_FILES} packages/demo-helper
	for x in menu docs hangouts music store; \
	  do mkdir -p packages/demo-$$x/_locales; \
	     cp -r locales/$$x-locales/* packages/demo-$$x/_locales; \
	done

third-party:
	mkdir -p gen/third-party
	cp third-party/chrome-cam/src/chrome/libs/glfx/glfx.min.js \
	   gen/third-party/glfx.js
	cd gen/third-party && patch -p0 < ../../patches/glfx.patch
	coffee -o gen/third-party -c \
	  third-party/chrome-cam/src/chrome/scripts/effects/effects.coffee \
	  third-party/chrome-cam/src/chrome/scripts/face/track.coffee
	cd gen/third-party && patch -p0 < ../../patches/effects.patch

crx: packages
	for x in ${TARGETS}; \
	  do ${CHROME} --pack-extension=packages/demo-$$x \
		       --pack-extension-key=packages/demo-$$x.pem; \
	done

zip: packages
	for x in ${TARGETS}; \
	  do scripts/remove-entry packages/demo-$$x/manifest.json key; \
	     zip -r packages/demo-$$x.zip packages/demo-$$x; \
	done

.PHONY: packages crx zip third-party
