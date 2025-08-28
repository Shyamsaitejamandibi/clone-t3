"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Send, Paperclip, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatMessage } from "@/lib/types";
import { UIMessage, UseChatHelpers } from "@ai-sdk/react";

const models = [
  { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-3", name: "Claude-3" },
];

interface ChatInputProps {
  chatId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  status: UseChatHelpers<ChatMessage>["status"];
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
}

export function ChatInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  messages,
  setMessages,
  sendMessage,
}: ChatInputProps) {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || status === "streaming") return;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="min-h-[60px] !bg-transparent border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={status === "streaming"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || status === "streaming"}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-primary/80 hover:bg-primary/90 disabled:opacity-30 rounded-lg backdrop-blur-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Model Selector and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg backdrop-blur-sm"
                    disabled={status === "streaming"}
                  >
                    {selectedModel.name}
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {models.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className="cursor-pointer"
                    >
                      {model.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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
            {status === "streaming" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={stop}
                className="h-8 px-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg backdrop-blur-sm"
              >
                Stop
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
