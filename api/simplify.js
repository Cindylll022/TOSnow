const fetch = require("node-fetch");

export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const payload = {
    prompt: `Simplify the following legal text:\n${text}`,
    max_tokens: 500,
    temperature: 0.5,
  };

  try {
    const apiResponse = await fetch("https://ai.google.dev/gemini-api/generateContent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: "API error" });
    }

    const responseData = await apiResponse.json();
    const simplifiedText = responseData.choices[0].text.trim();

    res.status(200).json({ simplified_text: simplifiedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}