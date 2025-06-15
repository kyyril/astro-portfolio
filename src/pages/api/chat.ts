import { GeminiService } from "../../services/gemini";

export default async function handler(req: any, res: any) {
  try {
    const geminiService = new GeminiService("test");
    const messages = [{ role: "user" as "user", parts: [{ text: "Hello" }] }];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const chunk of geminiService.streamGenerateContent(messages)) {
      res.write(`data: ${chunk}\n\n`);
    }

    res.end();
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
}
