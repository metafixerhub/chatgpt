import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.EXPLABS_API_KEY,
  baseURL: "https://api.experientiallabs.ai/v1",
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await client.chat.completions.create({
      model: "claude-fable-5.1",
      messages,
    });

    res.json({
      message: completion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI request failed",
    });
  }
});

app.listen(3000, () => {
  console.log("AI chatbot running on http://localhost:3000");
});
