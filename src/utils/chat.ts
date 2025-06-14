import type { Message } from "../types/chat";

export function extractChatTitle(messages: Message[]): string {
  if (messages.length <= 1) return "New Chat";

  const firstUserMessage = messages.find((msg) => msg.isUser);
  if (!firstUserMessage) return "New Chat";

  let title = firstUserMessage.text;

  // Try to get the first sentence
  const sentenceEnd = title.search(/[.!?]/);
  if (sentenceEnd > 0 && sentenceEnd < 50) {
    title = title.substring(0, sentenceEnd + 1);
  }
  // Otherwise limit to a reasonable length
  else if (title.length > 30) {
    title = title.substring(0, 30) + "...";
  }

  return title;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseMarkdown(text: string): string {
  // Simple markdown parser for basic formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-surface px-1 rounded text-sm">$1</code>'
    )
    .replace(/\n/g, "<br>")
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-surface p-3 rounded mt-2 overflow-x-auto"><code>$1</code></pre>'
    );
}
