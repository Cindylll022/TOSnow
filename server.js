const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 3000; // Set the port

// Middleware
app.use(cors({
    origin: 'chrome-extension://<your-extension-id>' // Restrict CORS to your extension
}));
app.use(express.json()); // Parse JSON request bodies

// Simplify route
app.post('/api/simplify', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent`;

    const payload = {
        prompt: `Simplify the following legal text:\n${text}`,
        max_tokens: 500,
        temperature: 0.7,
    };

    try {
        // Use dynamic import for node-fetch
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Response Error:", response.statusText, errorText);
            return res.status(response.status).json({ error: response.statusText, details: errorText });
        }

        const responseData = await response.json();
        const simplifiedText = responseData.choices && responseData.choices[0]?.text ? responseData.choices[0].text.trim() : "No simplified text received.";

        res.status(200).json({ simplified_text: simplifiedText });
    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
