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
                // Assuming results contain the simplified text
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

// This function is invoked by the content script
function simplifyTermsAndConditions() {
    const termsKeywords = ["terms", "conditions", "privacy", "agreement", "liability", "disclaimer", "warranty"];
    
    function detectTermsAndConditions(text) {
        return termsKeywords.some(keyword => text.toLowerCase().includes(keyword));
    }
    
    function findTnCSections() {
        const paragraphs = document.querySelectorAll("p, div");
        const detectedSections = [];

        paragraphs.forEach(paragraph => {
            const text = paragraph.innerText || paragraph.textContent;
            if (text && detectTermsAndConditions(text)) {
                detectedSections.push(text);
            }
        });

        return detectedSections.join("\n\n");
    }

    // Simulating the fetch request for simplification
    const tncText = findTnCSections();
    
    if (tncText) {
        // Assuming you have a local server running and a valid endpoint
        fetch("http://localhost:3000/api/simplify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: tncText })
        })
        .then(response => response.json())
        .then(data => {
            // Return the simplified text from the content script
            return data.simplified_text || "No simplified text received.";
        })
        .catch(error => {
            console.error("Error:", error);
            return "An error occurred while simplifying the terms and conditions.";
        });
    } else {
        return "No terms and conditions found on this page.";
    }
}
