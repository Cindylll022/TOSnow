// Import node-fetch to make HTTP requests
const fetch = require("node-fetch");

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight request
  }

  // Extract text from the request body
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Prepare payload for the Generative Language API
  const model = 'models/text-bison'; // Specify your model
  const url = `https://generativelanguage.googleapis.com/v1beta/gemini-1.5-flash:generateContent`;
  
  const payload = {
    prompt: `Simplify the following legal text:\n${text}`,
    max_tokens: 500,
    temperature: 0.7,
  };

  try {
    // Make the API call to Google Generative Language API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`, // Replace with your actual API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check for API response errors
    if (!response.ok) {
      console.error("API Response Error:", response.statusText);
      return res.status(response.status).json({ error: response.statusText });
    }

    // Parse the API response
    const responseData = await response.json();
    const simplifiedText = responseData.choices[0].text.trim();

    // Send back the simplified text as the response
    res.status(200).json({ simplified_text: simplifiedText });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

