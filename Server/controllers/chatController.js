import fetch from "node-fetch";
import Chat from "../models/Chat.js";

export const askQuestion = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Question required" });
  }

  try {
    const body = {
      contents: [{ parts: [{ text }] }],
    };

    if (process.env.SYSTEM_PROMPT) {
      body.system_instruction = {
        parts: [{ text: process.env.SYSTEM_PROMPT }],
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      answer,
    });

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI request failed" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(chats);
  } catch {
    res.status(500).json({ message: "Failed to load history" });
  }
};