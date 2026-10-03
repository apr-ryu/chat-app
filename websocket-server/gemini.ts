import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { GeminiChatLog } from "../app/types";

dotenv.config({
  path: "/Users/april/Desktop/Practice Projects/WS-messanger/my-app/.env",
});

console.log(
  "Gemini API key:",
  process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND",
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// export async function askGemini(message: string) {
//   const response = await ai.models.generateContent({
//     model: "gemini-3.6-flash",
//     contents: message,
//   });
//   return response.text;
// }

export async function askGemini(messages: GeminiChatLog[]) {
  const contents = messages.map((message) => ({
    role: message.role,
    parts: [
      {
        text: message.text,
      },
    ],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: contents,
  });

  return response.text;
}
