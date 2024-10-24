const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Simplify route
app.post('/api/simplify', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const prompt = `Simplify the following legal text in 50 words max in a simple manner in layman's terms, ensure that important agreements that users should know about is included, and format the result with appropriate HTML tags (such as bulletpoints), underline and bold important information:\n${text}`;

    try {
        // Generate content using the model
        const result = await model.generateContent(prompt);

        if (result && result.response) {
            const simplifiedText = result.response.text(); // Get the simplified text
            res.status(200).json({ simplified_text: simplifiedText });
        } else {
            res.status(500).json({ error: "No response from the model" });
        }
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

