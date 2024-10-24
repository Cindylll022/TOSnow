document.getElementById('simplifyBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: simplifyTermsAndConditions
        });
    });
});

function simplifyTermsAndConditions() {
    // Logic to simplify terms and conditions goes here
    alert("Simplifying terms and conditions...");
}
// popup