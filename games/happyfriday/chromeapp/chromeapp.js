chrome.app.runtime.onLaunched.addListener(function() {
  // normal launch initiated by the user, let's start clean.
  // note that this is not related to the persistent state, which is
  // appropriately handled in the window code.
  //  runApp(false);
  chrome.app.window.create('index.html',
    //{width: 800, height: 450});
  	{width: 1000, height: 562});
});
