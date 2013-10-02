CHROME=/opt/google/chrome/chrome

TARGETS = menu docs hangouts music store helper

MENU_FILES = \
  assets/close-1x.png \
  assets/close-2x.png \
  assets/docs-icon-128.png \
  assets/docs-icon-64.png \
  assets/hangouts-icon-128.png \
  assets/hangouts-icon-64.png \
  assets/menu-icon-128.png \
  assets/menu-icon-16.png \
  assets/menu-icon-48.png \
  assets/menu-logo-1x.png \
  assets/menu-logo-2x.png \
  assets/music-icon-128.png \
  assets/music-icon-64.png \
  assets/store-icon-128.png \
  assets/store-icon-64.png \
  assets/youtube-icon-128.png \
  assets/youtube-icon-64.png \
  css/common.css \
  css/menu-app.css \
  js/app.js \
  js/background.js \
  js/downloader.js \
  js/menu-app.js \
  js/screensaver.js \
  js/screensaver-client.js \
  js/util.js \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/screensaver/screensaver.html \
  third-party/screensaver/screensaver-video.webm \
  views/downloader.html \
  views/menu-app.html
#  third-party/sample-files/"1995 Field Notes.docx" \
#  third-party/sample-files/"Chromebook Backup.mov" \
#  third-party/sample-files/Arches.png \
#  third-party/sample-files/Night.png \
#  third-party/sample-files/Song.mp3 \

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
  assets/docs-ruler.png \
  assets/docs-section-anywhere-1x.png \
  assets/docs-section-anywhere-2x.png \
  assets/docs-section-backup-1x.png \
  assets/docs-section-backup-2x.png \
  assets/docs-section-group-1x.png \
  assets/docs-section-group-2x.png \
  assets/docs-share-1x.png \
  assets/docs-share-2x.png \
  assets/docs-toolbar-1x.png \
  assets/docs-toolbar-2x.png \
  assets/docs-user-charles-1x.png \
  assets/docs-user-charles-2x.png \
  assets/docs-user-edgar-1x.png \
  assets/docs-user-edgar-2x.png \
  assets/docs-user-fredrick-1x.png \
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
  third-party/docs-bot-words/words_de.json \
  third-party/docs-bot-words/words_en_GB.json \
  third-party/docs-bot-words/words_en.json \
  third-party/docs-bot-words/words_fi.json \
  third-party/docs-bot-words/words_fr.json \
  third-party/docs-bot-words/words_ms.json \
  third-party/docs-bot-words/words_nl.json \
  third-party/docs-bot-words/words_pt_BR.json \
  third-party/docs-bot-words/words_ru.json \
  third-party/docs-bot-words/words_sv.json \
  third-party/docs-bot-words/words_zh_CN.json \
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
  assets/hangouts-button-add-1x.png \
  assets/hangouts-button-add-2x.png \
  assets/hangouts-button-effects-1x.png \
  assets/hangouts-button-effects-2x.png \
  assets/hangouts-button-invite-1x.png \
  assets/hangouts-button-invite-2x.png \
  assets/hangouts-button-screenshare-1x.png \
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
  third-party/google-plus/scuba-mask.png \
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
  assets/music-equalizer-1x.gif \
  assets/music-equalizer-2x.gif \
  assets/music-icon-128.png \
  assets/music-icon-32.png \
  assets/music-icon-48.png \
  assets/music-icon-64.png \
  assets/music-icon-96.png \
  assets/music-pause-control-1x.png \
  assets/music-pause-control-2x.png \
  assets/music-play-control-1x.png \
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
  third-party/music-covers/music-cover-blake-shelton.jpg \
  third-party/music-covers/music-cover-ellie-goulding.jpg \
  third-party/music-covers/music-cover-florence.jpg \
  third-party/music-covers/music-cover-frank-ocean.jpg \
  third-party/music-covers/music-cover-imagine-dragons.jpg \
  third-party/music-covers/music-cover-lumineers.jpg \
  third-party/music-covers/music-cover-maroon5.jpg \
  third-party/music-covers/music-cover-mika.jpg \
  third-party/music-covers/music-cover-muse.png \
  third-party/music-covers/music-cover-one-republic.jpg \
  third-party/music-covers/music-cover-tegan-and-sara.png \
  third-party/music-covers/music-cover-the-doors.png \
  third-party/music-covers/music-cover-tiesto.jpg \
  third-party/music-covers/music-cover-vivaldi.png \
  third-party/music-covers/music-cover-war.png \
  third-party/music/music-lumineers.mp3 \
  third-party/music/music-vivaldi.mp3 \
  third-party/music/music-war.mp3 \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/roboto/Roboto-Light.ttf \
  third-party/roboto/Roboto-ThinItalic.ttf \
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
  third-party/app-tiles/store-tile-angry-birds.jpg \
  third-party/app-tiles/store-tile-bejeweled.png \
  third-party/app-tiles/store-tile-calculator.png \
  third-party/app-tiles/store-tile-calendar.jpg \
  third-party/app-tiles/store-tile-camera.png \
  third-party/app-tiles/store-tile-deezer.jpg \
  third-party/app-tiles/store-tile-docs.png \
  third-party/app-tiles/store-tile-drive.png \
  third-party/app-tiles/store-tile-evernote.jpg \
  third-party/app-tiles/store-tile-gmail.jpg \
  third-party/app-tiles/store-tile-hangouts.jpg \
  third-party/app-tiles/store-tile-kindle.png \
  third-party/app-tiles/store-tile-netflix.png \
  third-party/app-tiles/store-tile-new-york-times.jpg \
  third-party/app-tiles/store-tile-pandora.jpg \
  third-party/app-tiles/store-tile-pixlr.png \
  third-party/app-tiles/store-tile-play.png \
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
  views/licence.html \
  third-party/platform-analytics/google-analytics-bundle.js \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf \
  third-party/open-sans/OpenSans-Semibold.ttf \
  third-party/open-sans/OpenSans-Bold.ttf \
  third-party/learn-more/chrome-32.png \
  third-party/learn-more/chromebook-retailer.min.js \
  third-party/learn-more/learn-more.js \
  third-party/learn-more/chrome-retailers.min.css \
  third-party/learn-more/dot.png \
  third-party/learn-more/open-sans.css \
  third-party/learn-more/chrome-logo-1x.png \
  third-party/learn-more/chrome-logo-2x.png \
  third-party/learn-more/learn-more.html \
  third-party/learn-more/learn-more-features-speed.png \
  third-party/learn-more/learn-more-features-apps.jpg \
  third-party/learn-more/learn-more-features-security.png \
  third-party/learn-more/learn-more-printing.png \
  third-party/learn-more/learn-more-offline.jpg \
  third-party/learn-more/learn-more-do-more.png

packages: third-party
	# Menu.app
	mkdir -p packages/demo-menu/_locales
	cp manifests/menu-manifest.json packages/demo-menu/manifest.json
	cp ${MENU_FILES} packages/demo-menu
	cp -r locales/menu-locales/* packages/demo-menu/_locales
	# Docs.app
	mkdir -p packages/demo-docs/_locales
	cp manifests/docs-manifest.json packages/demo-docs/manifest.json
	cp ${DOCS_FILES} packages/demo-docs
	cp -r locales/docs-locales/* packages/demo-docs/_locales
	# Hangouts.app
	mkdir -p packages/demo-hangouts/_locales
	cp manifests/hangouts-manifest.json packages/demo-hangouts/manifest.json
	cp ${HANGOUTS_FILES} packages/demo-hangouts
	cp -r locales/hangouts-locales/* packages/demo-hangouts/_locales
	# Music.app
	mkdir -p packages/demo-music/_locales
	cp manifests/music-manifest.json packages/demo-music/manifest.json
	cp ${MUSIC_FILES} packages/demo-music
	cp -r locales/music-locales/* packages/demo-music/_locales
	# Store.app
	mkdir -p packages/demo-store/_locales
	cp manifests/store-manifest.json packages/demo-store/manifest.json
	cp ${STORE_FILES} packages/demo-store
	cp -r locales/store-locales/* packages/demo-store/_locales
	# Helper.app
	mkdir -p packages/demo-helper/_locales
	cp manifests/helper-manifest.json packages/demo-helper/manifest.json
	cp ${HELPER_FILES} packages/demo-helper
	cp -r locales/helper-locales/* packages/demo-helper/_locales

third-party:
	mkdir -p gen/third-party
	cp third-party/chrome-cam/src/chrome/libs/glfx/glfx.min.js \
	   gen/third-party/glfx.js
	cd gen/third-party && patch -p0 < ../../patches/glfx.patch
	coffee -o gen/third-party -c \
	  third-party/chrome-cam/src/chrome/scripts/effects/effects.coffee \
	  third-party/chrome-cam/src/chrome/scripts/face/track.coffee
	cd gen/third-party && patch -p0 < ../../patches/effects.patch
	cd gen/third-party && patch -p0 < ../../patches/track.patch

crx: packages
	scripts/rewrite-id
	${CHROME} --pack-extension=packages/demo-menu \
		  --pack-extension-key=pem/demo-menu.pem
	${CHROME} --pack-extension=packages/demo-docs \
		  --pack-extension-key=pem/demo-docs.pem
	${CHROME} --pack-extension=packages/demo-hangouts \
		  --pack-extension-key=pem/demo-hangouts.pem
	${CHROME} --pack-extension=packages/demo-music \
		  --pack-extension-key=pem/demo-music.pem
	${CHROME} --pack-extension=packages/demo-store \
		  --pack-extension-key=pem/demo-store.pem
	${CHROME} --pack-extension=packages/demo-helper \
		  --pack-extension-key=pem/demo-helper.pem

zip: packages
	scripts/remove-entry packages/demo-menu/manifest.json key
	zip -r packages/demo-menu.zip packages/demo-menu
	scripts/remove-entry packages/demo-docs/manifest.json key
	zip -r packages/demo-docs.zip packages/demo-docs
	scripts/remove-entry packages/demo-hangouts/manifest.json key
	zip -r packages/demo-hangouts.zip packages/demo-hangouts
	scripts/remove-entry packages/demo-music/manifest.json key
	zip -r packages/demo-music.zip packages/demo-music
	scripts/remove-entry packages/demo-store/manifest.json key
	zip -r packages/demo-store.zip packages/demo-store
	scripts/remove-entry packages/demo-helper/manifest.json key
	zip -r packages/demo-helper.zip packages/demo-helper

clean:
	rm -r gen
	rm -r packages

.PHONY: packages crx zip third-party clean
