var MAIN_APPS_ID = "ejpaejipmgoifefhjkmnghkpaklpeadp";
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.runtime.sendMessage(MAIN_APPS_ID, {name: 'launchPlay'});
});
