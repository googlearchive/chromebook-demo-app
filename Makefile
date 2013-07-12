CHROME=/opt/google/chrome/chrome

TARGETS = menu docs hangouts play game helper

MENU_FILES = \
  js/menu-app.js \
  js/define.js \
  js/util.js \
  css/common.css \
  css/menu-app.css \
  css/docs-app.css \
  css/hangouts-app.css \
  css/play-app.css \
  assets/arrow.png \
  assets/docs-icon-128.png \
  assets/hangouts-icon-128.png \
  assets/play-icon-128.png \
  views/main.html \
  third-party/glfx.js/glfx.js \
  third-party/ccv/js/ccv.js \
  third-party/ccv/js/face.js \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

DOCS_FILES = \
  js/menu-app.js \
  js/util.js \
  css/common.css \
  css/menu-app.css \
  assets/docs-icon-32.png \
  assets/docs-icon-128.png \
  assets/arrow.png \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

HANGOUTS_FILES = \
  js/hangouts-app.js \
  js/util.js \
  css/common.css \
  css/hangouts-app.css \
  assets/hangouts-icon-32.png \
  assets/hangouts-icon-128.png \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

PLAY_FILES = \
  js/play-app.js \
  js/util.js \
  css/common.css \
  css/play-app.css \
  assets/play-icon-32.png \
  assets/play-icon-128.png \
  third-party/open-sans/OpenSans-Light.ttf \
  third-party/open-sans/OpenSans-Regular.ttf

GAME_FILES= \
  js/game-app.js \
  js/util.js \
  assets/game-icon-32.png \
  assets/game-icon-128.png

HELPER_FILES= \
  js/helper-extension.js \
  js/util.js

packages:
	for x in ${TARGETS}; \
	  do mkdir -p packages/demo-$$x; \
	  cp manifests/$$x-manifest.json packages/demo-$$x/manifest.json; \
	done
	third-party/glfx.js/build.py
	mv glfx.js packages/demo-menu
	coffee -o packages/demo-menu -c \
	  third-party/chrome-cam/src/chrome/scripts/effects/effects.coffee \
	  third-party/chrome-cam/src/chrome/scripts/face/track.coffee
	cp ${MENU_FILES} packages/demo-menu
	cp ${DOCS_FILES} packages/demo-docs
	cp ${HANGOUTS_FILES} packages/demo-hangouts
	cp ${PLAY_FILES} packages/demo-play
	cp ${GAME_FILES} packages/demo-game
	cp ${HELPER_FILES} packages/demo-helper

crxs: packages
	for x in ${TARGETS}; \
	  do ${CHROME} --pack-extension=packages/demo-$$x \
		       --pack-extension-key=packages/demo-$$x.pem; \
	done

.PHONY: packages crxs third-party
