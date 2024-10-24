document.getElementById('simplifyBtn').addEventListener('click', () => {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('output').innerHTML = ''; 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Execute the content script function
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => window.simplifyTermsAndConditions()
        });
    });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.summary) {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('output').innerHTML += `<div class = "textBox"><h2>Simplified T&C:</h2>${message.summary} </div>`;
    } else if (message.error) {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('output').innerHTML += `<p style="color: red;">Error: ${message.error}</p>`;
    }
});
