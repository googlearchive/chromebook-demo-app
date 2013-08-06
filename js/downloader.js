var ENOUGH_TIME_TO_DOWNLOAD = 1000 * 10;
var Downloader = function() {};

Downloader.prototype.checkParamerter = function() {
  var params = {};
  var pairs = location.search.substr(1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    params[pair[0]] = decodeURI(pair[1]);
  }
  if (!(params.url && params.filename)) {
    // The script is run on the background page.
    this.openDownloadWindows();
    chrome.app.runtime.onLaunched.addListener(
        this.openDownloadWindows.bind(this));
  } else {
    // The script is run on the download window.
    this.downloadFileAndClose(params.url, params.filename);
  }
};

Downloader.prototype.openDownloadWindows = function() {
  var steps = [
    function() {
      chrome.storage.local.get('sampleFileDownloaded', steps.shift());
    },
    function(storage) {
      var flag = !!storage.sampleFileDownloaded;
      if (flag)
        return;
      chrome.storage.local.set({sampleFileDownloaded: true}, steps.shift());
    },
    function() {
      if (chrome.runtime.lastError)
        return;
      var files = [
        '1995 Field Notes.docx',
        'Arches.png',
        'Chromebook Backup.mov',
        'Night.png',
        'Song.mp3'
      ];
      for (var i = 0; i < files.length; i++) {
        chrome.app.window.create(
            'downloader.html?url=' + files[i] + '&filename=' + files[i], {
               hidden: true
            });
      }
    }
  ];
  steps.shift()();
};

Downloader.prototype.downloadFileAndClose = function(url, filename) {
  // Download file.
  var a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();

  // Close the window.
  setTimeout(function() {
    chrome.app.window.current().close();
  }, ENOUGH_TIME_TO_DOWNLOAD);
};

new Downloader().checkParamerter();
