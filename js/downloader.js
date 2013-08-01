var ENOUGH_TIME_TO_DOWNLOAD = 1000 * 10;

// Check request
var params = {};
var pairs = location.search.substr(1).split('&');
for (var i = 0; i < pairs.length; i++) {
  var pair = pairs[i].split('=');
  params[pair[0]] = decodeURI(pair[1]);
}

// Download file.
console.log(params);
var a = document.createElement('a');
a.setAttribute('href', params.url);
a.setAttribute('download', params.filename);
a.click();

// Close the window.
setTimeout(function() {
  chrome.app.window.current().close();
}, ENOUGH_TIME_TO_DOWNLOAD);
