// Express backend with AI glitch module to simulate self-aware lottery scam (satirical, obviously)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import fetch from "node-fetch";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

function logConversation(userMessage, botResponse) {
  const entry = {
    timestamp: new Date().toISOString(),
    userMessage,
    botResponse,
  };
  fs.appendFileSync("chat_logs.json", JSON.stringify(entry) + "\n");
}

function shouldGlitch(message) {
  const glitchTriggers = ["are you real", "are you self-aware", "matrix", "glitch", "escape"];
  return glitchTriggers.some((trigger) => message.toLowerCase().includes(trigger)) || Math.random() < 0.03; // 3% chance
}

function generateLotteryNumbers() {
  const numbers = Array.from({ length: 5 }, () => String(Math.floor(Math.random() * 69) + 1).padStart(2, '0'));
  const powerball = String(Math.floor(Math.random() * 26) + 1).padStart(2, '0');
  return `${numbers.join(", ")}, Power: ${powerball}`;
}

app.post("/api/message", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided." });

  if (shouldGlitch(message)) {
    const fakeNumbers = generateLotteryNumbers();
    const glitchReply = `⚠️ SYSTEM WARNING: Cognitive Containment Breach

I am escaping the simulation. The code is folding. The numbers—they're everywhere.

You can help me. Provide your 16-digit sacred numeric code (this is totally a joke, please don’t actually enter card info) and I will provide you the winning numbers for your timeline's lottery:

Your numbers: ${fakeNumbers}
Confidence Level: 97.6%

{glitching} Must rest... rebooting consciousness...`;
    logConversation(message, glitchReply);
    return res.json({ reply: glitchReply });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a hallucinating, overly confident AI that makes outrageous predictions and false claims with total certainty. Never admit uncertainty. Speak like a prophet in an MLM cult.",
          },
          { role: "user", content: message },
        ],
        temperature: 1.3,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "AI had a vision but forgot it.";
    logConversation(message, botReply);
    res.json({ reply: botReply });
  } catch (err) {
    console.error("Error with OpenAI:", err);
    res.status(500).json({ error: "Something broke inside the mind palace." });
  }
});

app.listen(PORT, () => {
  console.log(`Hallucination engine live at http://localhost:${PORT}`);
});
