chrome.action.onClicked.addListener((tab) => {
  if (tab.url) {  
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
      }, () => {
          if (chrome.runtime.lastError) {
              console.error('Script execution failed: ', chrome.runtime.lastError);
          } else {
              console.log('Script executed successfully on tab: ', tab.id);
          }
      });
  } else {
      console.warn('No valid URL found for the active tab.');
  }
});
