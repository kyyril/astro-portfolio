import React, { useState, useEffect, useRef } from "react";
import { Button } from "./common/Button";
import { PlusIcon } from "src/assets/icon/PlusIcon";
import { ScrollArea } from "./common/ScrollAre";
import { TrashIcon } from "src/assets/icon/trashIcon";
import { Dialog } from "./common/Dialog";
import { Card } from "./common/Card";
import { MenuIcon } from "src/assets/icon/menuIcon";
import { SimpleMarkdown } from "./common/Markdown";
import { LoadingIcon } from "src/assets/icon/loadingIcon";
import { SendIcon } from "src/assets/icon/sendIcon";

// Type Definitions
interface Message {
  text: string;
  isUser: boolean;
  id: string;
}
interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  aiHistory: AIHistoryItem[];
  userId: string;
}

interface AIHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

// Mock Google Generative AI
const mockGenerateResponse = async (
  message: string,
  history: AIHistoryItem[]
): Promise<string> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  const responses: string[] = [
    "Hello! I'm Katou, your AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's what I think:",
    "Great question! Based on what you've shared, I'd suggest:",
    "I'm here to help! Let me provide you with some insights:",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse}\n\n*This is a demo response since the actual Gemini API is not connected.*`;
};

// Utility functions
const generateMessageId = (): string => `msg-${Date.now()}-${Math.random()}`;

const generateUserId = (): string => `user-${Date.now()}`;

const getStorageKey = (userId: string): string => `katou-chats-${userId}`;

const extractChatTitle = (chatMessages: Message[]): string => {
  if (chatMessages.length <= 1) return "New Chat";

  const firstUserMessage = chatMessages.find((msg) => msg.isUser);
  if (!firstUserMessage) return "New Chat";

  let title = firstUserMessage.text;
  const sentenceEnd = title.search(/[.!?]/);
  if (sentenceEnd > 0 && sentenceEnd < 50) {
    title = title.substring(0, sentenceEnd + 1);
  } else if (title.length > 30) {
    title = title.substring(0, 30) + "...";
  }

  return title;
};

// Main Chat Component
export const AiChat: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "How can I help you today?",
      isUser: false,
      id: generateMessageId(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [aiHistory, setAiHistory] = useState<AIHistoryItem[]>([]);
  const [savedChats, setSavedChats] = useState<ChatHistory[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate user ID on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("katou-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateUserId();
      localStorage.setItem("katou-user-id", newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Load saved chats
  useEffect(() => {
    if (userId) {
      const savedChatsData = localStorage.getItem(getStorageKey(userId));
      if (savedChatsData) {
        try {
          const parsedChats: ChatHistory[] = JSON.parse(savedChatsData);
          setSavedChats(parsedChats);
        } catch (error) {
          console.error("Error parsing saved chats:", error);
          setSavedChats([]);
        }
      }
    }
  }, [userId]);

  const saveCurrentChat = (): string | null => {
    if (!userId || messages.length <= 1) return null;

    const chatId = activeChat || Date.now().toString();
    let title: string;

    if (activeChat) {
      const existingChat = savedChats.find((chat) => chat.id === activeChat);
      title = existingChat?.title || extractChatTitle(messages);
    } else {
      title = extractChatTitle(messages);
    }

    const chatToSave: ChatHistory = {
      id: chatId,
      title,
      messages,
      timestamp: Date.now(),
      aiHistory,
      userId,
    };

    let updatedChats: ChatHistory[];
    if (activeChat) {
      updatedChats = savedChats.map((chat) =>
        chat.id === activeChat ? chatToSave : chat
      );
    } else {
      updatedChats = [chatToSave, ...savedChats];
    }

    setSavedChats(updatedChats);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updatedChats));
    setActiveChat(chatId);

    return chatId;
  };

  const startNewChat = (): void => {
    if (messages.length > 1) {
      saveCurrentChat();
    }

    setMessages([
      {
        text: "How can I help you today?",
        isUser: false,
        id: generateMessageId(),
      },
    ]);
    setAiHistory([]);
    setActiveChat(null);
    setInput("");
    setShowSidebar(false);
  };

  const loadChat = (chatId: string): void => {
    const chatToLoad = savedChats.find((chat) => chat.id === chatId);
    if (!chatToLoad) return;

    setMessages(
      chatToLoad.messages.map((msg) => ({
        ...msg,
        id: msg.id || generateMessageId(),
      }))
    );
    setAiHistory(chatToLoad.aiHistory || []);
    setActiveChat(chatId);
    setShowSidebar(false);
  };

  const confirmDeleteChat = (chatId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setShowDeleteDialog(true);
  };

  const deleteChat = (): void => {
    if (!chatToDelete) return;

    const updatedChats = savedChats.filter((chat) => chat.id !== chatToDelete);
    setSavedChats(updatedChats);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(updatedChats));

    if (activeChat === chatToDelete) {
      startNewChat();
    }

    setChatToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter" && !pending) {
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMessageId = generateMessageId();
    const newMessages: Message[] = [
      ...messages,
      { text: userMessage, isUser: true, id: userMessageId },
    ];
    setMessages(newMessages);

    const newAiHistory: AIHistoryItem[] = [
      ...aiHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];
    setAiHistory(newAiHistory);

    setInput("");
    setPending(true);

    try {
      const responseText = await mockGenerateResponse(userMessage, aiHistory);
      const responseId = generateMessageId();

      setMessages((prev) => [
        ...prev,
        { text: responseText, isUser: false, id: responseId },
      ]);

      const finalAiHistory: AIHistoryItem[] = [
        ...newAiHistory,
        { role: "model", parts: [{ text: responseText }] },
      ];
      setAiHistory(finalAiHistory);

      setTimeout(() => saveCurrentChat(), 500);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "An error occurred. Please try again.",
          isUser: false,
          id: generateMessageId(),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const ChatSidebar: React.FC = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text">Chat History</h2>
        <p className="text-xs text-text/70 mt-1">
          <span className="text-accent">*</span> Saved in browser storage
        </p>
      </div>

      <div className="p-4">
        <Button onClick={startNewChat} className="w-full">
          <PlusIcon /> <span className="ml-2">New Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          {savedChats.length === 0 ? (
            <p className="text-sm text-text/50 text-center py-4">
              No chat history yet
            </p>
          ) : (
            savedChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-surface/30 group transition-colors ${
                  activeChat === chat.id ? "bg-surface/50" : ""
                }`}
                onClick={() => loadChat(chat.id)}
              >
                <div className="truncate flex-1">
                  <p className="text-sm font-medium text-text">{chat.title}</p>
                  <p className="text-xs text-text/50">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e: any) => confirmDeleteChat(chat.id, e)}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <style>
        {`
          :root {
            --color-primary: #64b5f6;
            --color-secondary: #81c784;
            --color-accent: #ff8a65;
            --color-background: #0f0f0f;
            --color-surface: #1a1a1a;
            --color-text: #e0e0e0;
            --color-border: #333333;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: var(--color-background);
            color: var(--color-text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--color-background);
          }
          ::-webkit-scrollbar-thumb {
            background: var(--color-border);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--color-primary);
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>

      <div className="max-w-6xl w-full h-screen px-4 mx-auto">
        <div className="flex h-full gap-4 py-4">
          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text mb-2">
                Delete Chat?
              </h3>
              <p className="text-text/70 mb-4">
                This will permanently delete this chat history. This action
                cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={deleteChat}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Dialog>

          {/* Mobile Sidebar Overlay */}
          {isMobile && showSidebar && (
            <div className="fixed inset-0 z-40 flex">
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setShowSidebar(false)}
              />
              <div className="relative z-50 w-64 bg-surface/90 backdrop-blur-lg border-r border-border">
                <ChatSidebar />
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          {!isMobile && (
            <Card className="w-64 h-full overflow-hidden">
              <ChatSidebar />
            </Card>
          )}

          {/* Main Chat Area */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-surface/30 backdrop-blur-sm">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(true)}
                >
                  <MenuIcon />
                </Button>
              )}

              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-bold">K</span>
                </div>
                <div>
                  <h1 className="font-medium text-text">Katou</h1>
                  <p className="text-xs text-secondary">Online</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={startNewChat}>
                <PlusIcon />
                {!isMobile && <span className="ml-2">New Chat</span>}
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.isUser
                          ? "bg-primary text-background ml-12"
                          : "bg-surface/50 backdrop-blur-sm border border-border text-text mr-12"
                      }`}
                    >
                      <SimpleMarkdown>{msg.text}</SimpleMarkdown>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface/30 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask something..."
                  onKeyDown={handleInputKeyDown}
                  disabled={pending}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={pending || !input.trim()}
                >
                  {pending ? <LoadingIcon /> : <SendIcon />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AiChat;
