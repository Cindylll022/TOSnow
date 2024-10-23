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
      const response = await fetch("https://tos-now.vercel.app/api/simplify", {
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
        // Use console.log for debugging and consider displaying in a user-friendly way
        console.log(data.simplified_text);
        // Display simplified text in a user-friendly modal or section here
      } else {
        console.log("No simplified text received.");
        alert("Could not simplify the terms and conditions. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while simplifying the terms and conditions.");
    }
  } else {
    console.log("No T&C detected on this page.");
    alert("No terms and conditions found on this page.");
  }
}


simplifyDetectedTnC();
