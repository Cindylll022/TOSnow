document.getElementById('simplifyBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: invokeSimplification
        });
    });
});

function invokeSimplification() {
    // Call the function defined in content.js
    if (typeof simplifyDetectedTnC === "function") {
        simplifyDetectedTnC(); // Ensure the function exists
    } else {
        console.error("Function simplifyDetectedTnC is not defined.");
    }
}

