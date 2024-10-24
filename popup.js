document.getElementById('simplifyBtn').addEventListener('click', () => {
    const loadingSpinner = document.getElementById('loading');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const errorText = document.getElementById('errorText');

    // Show loading spinner and hide previous results
    loadingSpinner.style.display = 'block';
    resultTitle.style.display = 'none';
    resultText.style.display = 'none';
    errorText.style.display = 'none';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: simplifyTermsAndConditions
        }, (results) => {
            loadingSpinner.style.display = 'none'; // Hide spinner after script execution

            if (chrome.runtime.lastError) {
                errorText.textContent = chrome.runtime.lastError.message;
                errorText.style.display = 'block';
            } else {
                // Assume results contain the simplified text
                const simplifiedText = results[0].result; // Adjust this based on how the result is returned
                if (simplifiedText) {
                    resultTitle.style.display = 'block';
                    resultText.textContent = simplifiedText;
                    resultText.style.display = 'block';
                } else {
                    errorText.textContent = "No simplified text received.";
                    errorText.style.display = 'block';
                }
            }
        });
    });
});

function simplifyTermsAndConditions() {
    // Logic to simplify terms and conditions (you may use the existing logic)
    alert("This function would contain the logic to simplify terms and conditions.");
    return "This is a placeholder for the simplified terms and conditions."; // Simulated return value
}
