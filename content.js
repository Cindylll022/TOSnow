const keywords = ["terms", "conditions", "privacy", "agreement", "liability", "disclaimer", "warranty"];

function detectTermsAndConditions(text) {
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
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

      const data = await response.json();

      if (data.simplified_text) {
        alert("Simplified T&C:\n" + data.simplified_text);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log("No T&C detected on this page.");
  }
}

simplifyDetectedTnC();

