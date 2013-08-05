CHROME=/opt/google/chrome/chrome

TARGETS = menu docs hangouts music store helper

MENU_FILES = \
  js/const.js \
  js/app.js \
  js/menu-app.js \
  js/util.js \
  js/downloader.js \
  css/common.css \
  css/menu-app.css \
  assets/menu-icon-16.png \
  assets/menu-icon-48.png \
  assets/menu-icon-128.png \
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
  js/const.js \
  js/app.js \
  js/editor.js \
  js/edit-distance.js \
  js/docs-app.js \
  js/util.js \
  js/words.js \
  js/paper-edit-adapter.js \
  css/common.css \
  css/docs-app.css \
  assets/docs-icon-32.png \
  assets/docs-icon-48.png \
  assets/docs-icon-64.png \
  assets/docs-icon-96.png \
  assets/docs-icon-128.png \
  assets/docs-section-group-2x.png \
  assets/docs-section-backup-2x.png \
  assets/docs-section-anywhere-2x.png \
  assets/docs-user-charles-2x.png \
  assets/docs-user-edgar-2x.png \
  assets/docs-user-fredrick-2x.png \
  assets/docs-share-2x.png \
  assets/docs-toolbar-2x.png \
  assets/docs-ruler-2x.png \
  assets/balloon-triangle-top-1x.png \
  assets/balloon-triangle-top-2x.png \
  assets/close-1x.png \
  assets/close-2x.png \
  views/docs-app.html \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

HANGOUTS_FILES = \
  js/const.js \
  js/app.js \
  js/effects-helper.js \
  js/hangouts-app.js \
  js/util.js \
  css/common.css \
  css/hangouts-app.css \
  assets/hangouts-icon-32.png \
  assets/hangouts-icon-48.png \
  assets/hangouts-icon-64.png \
  assets/hangouts-icon-96.png \
  assets/hangouts-icon-128.png \
  assets/hangouts-section-group-2x.png \
  assets/hangouts-section-everywhere-2x.png \
  assets/hangouts-section-fun-2x.png \
  assets/hangouts-button-add-2x.png \
  assets/hangouts-button-effects-2x.png \
  assets/hangouts-button-invite-2x.png \
  assets/hangouts-button-screenshare-2x.png \
  assets/balloon-triangle-top-1x.png \
  assets/balloon-triangle-top-2x.png \
  assets/balloon-triangle-bottom-1x.png \
  assets/balloon-triangle-bottom-2x.png \
  assets/glasses.png \
  assets/close-1x.png \
  assets/close-2x.png \
  gen/third-party/glfx.js \
  gen/third-party/effects.js \
  gen/third-party/track.js \
  views/hangouts-app.html \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/ccv/js/ccv.js \
  third-party/ccv/js/face.js


MUSIC_FILES = \
  js/const.js \
  js/app.js \
  js/music-app.js \
  js/util.js \
  css/common.css \
  css/music-app.css \
  assets/music-icon-32.png \
  assets/music-icon-48.png \
  assets/music-icon-64.png \
  assets/music-icon-96.png \
  assets/music-icon-128.png \
  assets/music-section-anywhere-2x.png \
  assets/music-section-upload-2x.png \
  assets/music-section-unlimited-2x.png \
  assets/balloon-triangle-left-1x.png \
  assets/balloon-triangle-left-2x.png \
  assets/balloon-triangle-right-1x.png \
  assets/balloon-triangle-right-2x.png \
  assets/music-play-control-2x.png \
  assets/music-pause-control-2x.png \
  assets/music-equalizer-2x.gif \
  assets/close-1x.png \
  assets/close-2x.png \
  views/music-app.html \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/roboto/Roboto-Light.ttf \
  third-party/roboto/Roboto-ThinItalic.ttf \
  third-party/music/sample-song.mp3

STORE_FILES= \
  js/const.js \
  js/app.js \
  js/store-app.js \
  js/util.js \
  css/common.css \
  css/store-app.css \
  assets/store-icon-32.png \
  assets/store-icon-48.png \
  assets/store-icon-64.png \
  assets/store-icon-96.png \
  assets/store-icon-128.png \
  assets/store-app.png \
  assets/store-app-top.png \
  assets/store-section-thousands-2x.png \
  assets/store-section-offline-2x.png \
  assets/store-section-install-2x.png \
  assets/close-1x.png \
  assets/close-2x.png \
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
  views/store-app.html \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

HELPER_FILES= \
  js/const.js \
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
