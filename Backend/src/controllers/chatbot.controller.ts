// backend/controllers/chatbot.controller.ts
import { Request, Response } from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithGroq = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",  // working model
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};