import { Request, Response } from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load FAQ JSON
const faqPath = path.join(__dirname, "../data/blood_faq.json");
const faqData: { question: string; answer: string }[] = JSON.parse(
  fs.readFileSync(faqPath, "utf-8")
);

// Better keyword-based matching
function checkFAQ(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  for (const item of faqData) {
    // split question into keywords and check if any appear in user message
    const keywords = item.question.toLowerCase().split(" ");
    const match = keywords.some(word => lowerMsg.includes(word));
    if (match) return item.answer;
  }
  return null;
}

export const chatWithGroq = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Check FAQ first
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) return res.json({ reply: faqAnswer });

    // AI fallback with stronger prompt
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `You are a friendly blood donation assistant. 
Answer only the exact question asked. 
Keep answers short, simple, and easy to understand. 
Use natural, human-like words. 
Do not explain unrelated points or add extra information.`
        },
        { role: "user", content: message }
      ],
      temperature: 0.5 // lower temp = more precise answers
    });

    const reply = completion.choices[0].message.content?.trim() || "";
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};