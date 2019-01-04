chrome.runtime.onInstalled.addListener(function() {
  console.log('run111')
  chrome.tabs.onCreated.addListener(function(tab){
    if (tab.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'hello!',
        url: tab.url
      })
    }
  })

  chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab) {
      // read changeInfo data and do something with it
      // like send the new url to contentscripts.js
      if (changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {
          message: 'hello!',
          url: changeInfo.url
        })
      }
    }
  );
});
