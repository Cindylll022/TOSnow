document.getElementById('simplifyBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: simplifyTermsAndConditions
        });
    });
});

function simplifyTermsAndConditions() {
    alert("Simplifying terms and conditions...");
    // The logic to simplify T&C will be executed through content.js
}
