"use client";

import { useState } from "react";
import { Send, Paperclip, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const models = [
  { id: "gpt-4.1-nano", name: "GPT-4.1 Nano" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "claude-3", name: "Claude-3" },
];

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="">
      <div className="max-w-3xl mx-auto p-3 border">
        <form onSubmit={handleSubmit} className="relative">
          {/* Input Field */}
          <div className="relative mb-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="pr-12 min-h-[52px] resize-none bg-muted/30 border-input/50 text-base focus-visible:ring-1 focus-visible:ring-ring rounded-xl pl-4"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:opacity-30 rounded-lg"
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
                    className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
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
                className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
              >
                Search
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
