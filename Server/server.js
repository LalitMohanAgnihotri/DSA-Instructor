import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userText = req.body.text;

  try {
    
    const body = {
      contents: [{ parts: [{ text: userText }] }]
    };

    if (process.env.SYSTEM_PROMPT) {
      body.system_instruction = {
        parts: [{ text: process.env.SYSTEM_PROMPT }]
      };
    }

    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

   
    const data = await response.json();

    
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
