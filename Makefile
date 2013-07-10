CHROME=/opt/google/chrome/chrome

all: main.crx extension.crx

main.crx:
	$(CHROME) --pack-extension=./main --pack-extension-key=main.pem
extension.crx:
	$(CHROME) --pack-extension=./extension --pack-extension-key=extension.pem

.PHONY: main.crx extension.crx