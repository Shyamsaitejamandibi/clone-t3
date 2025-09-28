"use client";

import { useQuery } from "convex/react";
import { ChatMain } from "./chat-main";
import { useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { ChatMessage } from "@/lib/types";

export const ChatLayout = ({ id, userId }: { id: string; userId: string }) => {
  const [initialChatModel, setInitialChatModel] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("chat-model");
    if (stored) {
      setInitialChatModel(stored);
    } else {
      localStorage.setItem("chat-model", "openai/gpt-4o");
      setInitialChatModel("openai/gpt-4o");
    }
  }, []);

  const initialMessages = useQuery(api.threads.getInitialMessages, {
    chatId: id,
  });
  if (initialMessages === undefined) {
    return <div>Loading chat...</div>;
  }

  const transformedMessages: ChatMessage[] = initialMessages
    ? initialMessages.map((msg) => ({
        id: msg._id,
        role: msg.role,
        parts: msg.parts,
        metadata: {
          modelId: msg.response?.modelName,
          tokenUsage: msg.response?.tokens,
        },
      }))
    : [];

  if (!initialChatModel) {
    return <div>Loading model...</div>;
  }

  return (
    <ChatMain
      id={id}
      userId={userId}
      initialMessages={transformedMessages}
      initialChatModel={initialChatModel}
      setInitialChatModel={setInitialChatModel}
    />
  );
};
