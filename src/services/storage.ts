import type { ChatHistory } from "../types/chat";

export class StorageService {
  private static USER_ID_KEY = "katou-user-id";
  private static CHATS_KEY_PREFIX = "katou-chats-";

  static getUserId(): string {
    if (typeof window === "undefined") return "";

    let userId = localStorage.getItem(this.USER_ID_KEY);
    if (!userId) {
      userId = `user-${Date.now().toString()}`;
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
    return userId;
  }

  static saveChats(userId: string, chats: ChatHistory[]): void {
    if (typeof window === "undefined") return;

    const key = `${this.CHATS_KEY_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(chats));
  }

  static loadChats(userId: string): ChatHistory[] {
    if (typeof window === "undefined") return [];

    const key = `${this.CHATS_KEY_PREFIX}${userId}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      try {
        return JSON.parse(savedData) as ChatHistory[];
      } catch (error) {
        console.error("Error parsing saved chats:", error);
        return [];
      }
    }

    return [];
  }

  static deleteChat(userId: string, chatId: string): ChatHistory[] {
    const chats = this.loadChats(userId);
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    this.saveChats(userId, updatedChats);
    return updatedChats;
  }

  static updateChat(userId: string, updatedChat: ChatHistory): ChatHistory[] {
    const chats = this.loadChats(userId);
    const chatIndex = chats.findIndex((chat) => chat.id === updatedChat.id);

    if (chatIndex >= 0) {
      chats[chatIndex] = updatedChat;
    } else {
      chats.unshift(updatedChat);
    }

    this.saveChats(userId, chats);
    return chats;
  }
}
