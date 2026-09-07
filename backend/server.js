import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.EXPLABS_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "Missing EXPLABS_API_KEY environment variable in Vercel." });
    }

    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.experientiallabs.ai/v1",
    });

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
      error: error.message || "AI request failed",
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log("AI chatbot running on http://localhost:3000");
  });
}

export default app;
