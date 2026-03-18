import { Request, Response } from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ inline data — no file system dependency
const faqData: { question: string; reply: string }[] = [
  { question: "Who can donate blood in Sri Lanka?", reply: "Healthy people aged 18-65, weighing at least 50kg, no major illnesses, not pregnant or breastfeeding." },
  { question: "Who cannot donate blood in Sri Lanka?", reply: "People with anemia, low weight, heart problems, high blood pressure, infections (HIV, hepatitis, malaria), recent surgery, pregnant women, or recent donors." },
  { question: "How often can I donate blood in Sri Lanka?", reply: "Whole blood: every 12 weeks. Platelets: every 4 weeks. Plasma: every 2 weeks. Double red cells: every 16 weeks." },
  { question: "What should I eat and drink before donating blood?", reply: "Iron-rich foods, drink water, avoid fatty foods, alcohol, and caffeine." },
  { question: "Is donating blood safe in Sri Lanka?", reply: "Yes. Sterile, single-use needles are used and staff monitor donors." },
  { question: "What are the blood types?", reply: "A, B, AB, O; each can be positive (+) or negative (-)." },
  { question: "Who can donate to whom?", reply: "O- → anyone, O+ → A+, B+, AB+, O+, A- → A-, A+, AB-, AB+, A+ → A+, AB+, B- → B-, B+, AB-, AB+, B+ → B+, AB+, AB- → AB-, AB+, AB+ → AB+ only." },
  { question: "What happens during blood donation?", reply: "Sit, nurse cleans arm, needle inserted, 350-450ml blood collected, rest and refreshment afterward." },
  { question: "Can I donate blood if I have medical conditions?", reply: "Some conditions like controlled diabetes or high blood pressure may be allowed; chronic diseases, infections, or recent surgeries may defer donation." },
  { question: "Why is blood donation important?", reply: "Saves lives in surgeries, accidents, cancer, anemia, and emergencies." },
  { question: "What should I do after donating blood?", reply: "Rest 10-15 min, drink water, eat well, avoid heavy activity." },
  { question: "Can I donate blood if I recently traveled?", reply: "Wait if traveled to malaria, Zika, or other infectious areas." },
  { question: "Can I donate blood if I take medications?", reply: "Depends on medication; some allowed, some deferred. Check with blood bank." },
  { question: "How is blood tested after donation?", reply: "Screened for HIV, hepatitis, syphilis, malaria; only safe blood is used." },
  { question: "What types of donations exist?", reply: "Whole blood, platelets, plasma, double red cells." },
  { question: "Can I donate blood if I had COVID-19?", reply: "Wait 14-28 days after full recovery." },
  { question: "What is the universal donor and recipient?", reply: "O- is universal donor; AB+ is universal recipient." },
  { question: "Why should I register with a blood donation website?", reply: "Track donations, check eligibility, get reminders, be contacted in emergencies." },
  { question: "Who can donate blood to me if my blood type is A+?", reply: "A+, A-, O+, O-." },
  { question: "Who can donate blood to me if my blood type is A-?", reply: "A-, O-." },
  { question: "Who can donate blood to me if my blood type is B+?", reply: "B+, B-, O+, O-." },
  { question: "Who can donate blood to me if my blood type is B-?", reply: "B-, O-." },
  { question: "Who can donate blood to me if my blood type is AB+?", reply: "All blood types." },
  { question: "Who can donate blood to me if my blood type is AB-?", reply: "AB-, A-, B-, O-." },
  { question: "Who can donate blood to me if my blood type is O+?", reply: "O+, O-." },
  { question: "Who can donate blood to me if my blood type is O-?", reply: "O- only." },
];

function checkFAQ(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  for (const item of faqData) {
    const keywords = item.question.toLowerCase().split(" ");
    const match = keywords.some(word => word.length > 3 && lowerMsg.includes(word));
    if (match) return item.reply;
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

    // AI fallback
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
      temperature: 0.5
    });

    const reply = completion.choices[0].message.content?.trim() || "";
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err });
  }
};