import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Input validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json(
        { error: "Message is required and must be non-empty" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(message.trim());

    const reply = result.response.text();

    return Response.json({ reply }, { status: 200 });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}