import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.EXPLABS_API_KEY,
  baseURL: "https://api.experientiallabs.ai/v1",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "claude-fable-5.1",
      messages,
    });

    return NextResponse.json({
      message: completion.choices[0].message,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
