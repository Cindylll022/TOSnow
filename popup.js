document.getElementById('simplifyBtn').addEventListener('click', () => {
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
        // Display the simplified text in the popup as bullet points
        displayResult(message.summary);
    } else if (message.error) {
        // Display any error messages
        document.body.innerHTML += `<p style="color: red;">Error: ${message.error}</p>`;
    }
});

// Function to display the result as bullet points
function displayResult(simplifiedText) {
    const resultContainer = document.createElement('div');
    resultContainer.innerHTML = `<h2>Simplified T&C:</h2><ul>${simplifiedText.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>`;
    
    // Append the result to the popup body
    document.body.appendChild(resultContainer);
}
