import type {
  GeminiMessage,
  GeminiResponse,
  GeminiStreamResponse,
} from "../types/chat";

export class GeminiService {
  private apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY;
  private baseUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(messages: GeminiMessage[]): Promise<string> {
    const url = `${this.baseUrl}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: messages.map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: msg.parts,
      })),
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error("No response from Gemini API");
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async *streamGenerateContent(
    messages: GeminiMessage[]
  ): AsyncGenerator<string, void, unknown> {
    const url = `${this.baseUrl}:streamGenerateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: messages.map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: msg.parts,
      })),
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    };

    try {
      // First try the non-streaming approach to handle array responses
      const fullResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!fullResponse.ok) {
        throw new Error(`HTTP error! status: ${fullResponse.status}`);
      }

      const responseText = await fullResponse.text();
      console.log("Full response text:", responseText);

      // Check if the response is an array
      if (responseText.trim().startsWith("[")) {
        try {
          const dataArray = JSON.parse(responseText);
          let fullText = "";

          // Combine all text parts from the array
          for (const data of dataArray) {
            if (
              data.candidates &&
              data.candidates[0]?.content?.parts[0]?.text
            ) {
              fullText += data.candidates[0].content.parts[0].text;
            }
          }

          console.log("Combined full text:", fullText);
          yield fullText;
          return;
        } catch (e) {
          console.error("Error parsing array response:", e);
        }
      }

      // If we get here, either it wasn't an array or we couldn't parse it
      // Fall back to streaming approach
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() && line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              if (jsonStr.trim() === "[DONE]") continue;

              // Check if the response is an array
              if (jsonStr.trim().startsWith("[")) {
                console.log("Received array response in stream:", jsonStr);
                const dataArray = JSON.parse(jsonStr);
                // Combine all text parts from the array into a single response
                let combinedText = "";
                for (const data of dataArray) {
                  if (
                    data.candidates &&
                    data.candidates[0]?.content?.parts[0]?.text
                  ) {
                    combinedText += data.candidates[0].content.parts[0].text;
                  }
                }
                if (combinedText) {
                  console.log("Combined text from stream:", combinedText);
                  yield combinedText;
                }
              } else {
                // Handle single response object
                console.log("Received single response in stream:", jsonStr);
                const data: GeminiStreamResponse = JSON.parse(jsonStr);
                if (
                  data.candidates &&
                  data.candidates[0]?.content?.parts[0]?.text
                ) {
                  yield data.candidates[0].content.parts[0].text;
                }
              }
            } catch (e) {
              console.error("JSON parsing error in stream:", e);
              // Skip malformed JSON
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }
}
