document.getElementById('simplifyBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: simplifyTermsAndConditions // This refers to the function in content.js
        });
    });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.summary) {
        // Display the simplified text in the popup
        document.body.innerHTML += `<h2>Simplified T&C:</h2><p>${message.summary}</p>`;
    } else if (message.error) {
        // Display any error messages
        document.body.innerHTML += `<p style="color: red;">Error: ${message.error}</p>`;
    }
});
