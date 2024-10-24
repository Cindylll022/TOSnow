chrome.action.onClicked.addListener((tab) => {
    if (tab && tab.url) {  // Ensure tab object and URL are valid
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Script execution failed: ', chrome.runtime.lastError.message);
            } else {
                console.log(`Script executed successfully on tab ID: ${tab.id}, URL: ${tab.url}`);
            }
        });
    } else {
        console.warn('No valid URL found for the active tab, or tab object is missing.');
    }
});
