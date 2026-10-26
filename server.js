import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(currentDir, ".env")
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(currentDir, "public")));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Reusable function for Gemini
async function generateAIContent(prompt) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is missing from the .env file.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
  });

  return response.text;
}

// Route 1: Joke
app.get("/joke", async (req, res) => {
  try {
    const joke = await generateAIContent(
      "Generate one short, clean, family-friendly joke."
    );

    res.json({ success: true, joke });
  } catch (error) {
    console.error("Joke error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to generate a joke. Check the server terminal."
    });
  }
});

// Route 2: Motivation
app.get("/motivation", async (req, res) => {
  try {
    const motivation = await generateAIContent(
      "Write one short, positive motivational message in 1-2 sentences."
    );

    res.json({ success: true, motivation });
  } catch (error) {
    console.error("Motivation error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to generate motivation. Check the server terminal."
    });
  }
});

// Route 3: Tip of the day
app.get("/tip-of-the-day", async (req, res) => {
  try {
    const tip = await generateAIContent(
      "Give one practical, useful daily-life or study tip in 1-2 sentences."
    );

    res.json({ success: true, tip });
  } catch (error) {
    console.error("Tip error:", error.message);
    res.status(500).json({
      success: false,
      error: "Unable to generate a tip. Check the server terminal."
    });
  }
});

// Start the backend
app.listen(PORT, () => {
  console.log(`AI Helper Bot running at http://localhost:${PORT}`);
});
