// backend/routes/chatbot.routes.ts
import { Router } from "express";
import { chatWithGroq } from "../controllers/chatbot.controller";

const router = Router();

// POST /api/chat
router.post("/", chatWithGroq);

export default router;