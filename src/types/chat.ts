export interface Message {
  text: string;
  isUser: boolean;
  id: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  aiHistory: GeminiMessage[];
  userId: string;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export interface GeminiStreamResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason?: string;
  }>;
}
