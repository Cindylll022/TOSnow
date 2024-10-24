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

async function simplifyDetectedTnC() {
    const tncText = findTnCSections();

    if (tncText) {
        try {
            const response = await fetch("http://localhost:3000/api/simplify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: tncText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.simplified_text) {
                // Send the simplified text back to the popup
                chrome.runtime.sendMessage({ summary: data.simplified_text });
            } else {
                chrome.runtime.sendMessage({ error: "No simplified text received." });
            }
        } catch (error) {
            console.error("Error:", error);
            chrome.runtime.sendMessage({ error: "An error occurred while simplifying the terms and conditions." });
        }
    } else {
        chrome.runtime.sendMessage({ error: "No terms and conditions found on this page." });
    }
}

// Export the function to the global scope
window.simplifyTermsAndConditions = simplifyDetectedTnC;
