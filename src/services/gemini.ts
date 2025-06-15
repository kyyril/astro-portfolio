import type { GeminiMessage } from "../types/chat";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export class GeminiService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.apiKey =
      typeof import.meta.env.PUBLIC_GEMINI_API_KEY === "function"
        ? import.meta.env.PUBLIC_GEMINI_API_KEY()
        : import.meta.env.PUBLIC_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async *streamGenerateContent(
    messages: GeminiMessage[]
  ): AsyncGenerator<string, void, unknown> {
    try {
      const result = await this.model.generateContentStream({
        contents: messages.map((msg) => ({
          role: msg.role === "model" ? "model" : "user",
          parts: msg.parts,
        })),
      });

      for await (const chunk of result.stream) {
        if (chunk.text) {
          yield chunk.text();
        }
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }
}
