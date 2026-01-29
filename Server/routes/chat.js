import express from "express";
import fetch from "node-fetch";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { text } = req.body;

  try {
    const body = {
      contents: [{ parts: [{ text }] }]
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

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join("") || "No response";

    await Chat.create({
      userId: req.userId,
      question: text,
      answer
    });

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI request failed" });
  }
});

export default router;
