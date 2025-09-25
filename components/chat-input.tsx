"use client";

import { Dispatch, memo, SetStateAction, useState } from "react";
import { Send, Paperclip, ChevronDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseChatHelpers } from "@ai-sdk/react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChatMessage } from "@/lib/types";
import ModelSelect from "./model-select";

interface ChatInputProps {
  id: string;
  userId: string;
  input: string;
  selectedModelId: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: () => void;
  messages: Array<ChatMessage>;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

export function PureChatInput({
  id,
  input,
  userId,
  setInput,
  selectedModelId,
  status,
  stop,
  messages,
  setMessages,
  sendMessage,
}: ChatInputProps) {
  const pathname = usePathname();
  const createChat = useMutation(api.threads.createChat);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || status === "streaming") return;

    // Create the chat only if this is the first message (no existing messages)
    if (messages.length === 0) {
      await createChat({
        userId,
        id,
        userPrompt: input,
      });
      // Navigate to the chat route if we're not already there
      window.history.pushState({}, "", `/chat/${id}`);
    }
    try {
      await sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: input }],
      });
      setInput(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-3xl mx-auto px-3 pb-3 border border-white/10 rounded-t-3xl bg-white/3 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          {/* Input Field */}
          <div className="relative mb-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="min-h-[60px] !bg-transparent border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={status === "streaming"}
            />
          </div>

          {/* Model Selector and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ModelSelect selectedModelId={selectedModelId} />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg backdrop-blur-sm"
                disabled={status === "streaming"}
              >
                Search
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg backdrop-blur-sm"
                disabled={status === "streaming"}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>

            {/* Stop button when chat is streaming */}
            {status === "streaming" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={stop}
                className="h-8 px-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg backdrop-blur-sm"
              >
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim()}
                className="h-8 px-3  text-white rounded-lg"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages !== nextProps.messages) return false;

  return true;
});
