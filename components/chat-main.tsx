"use client";

import React from "react";
import { Send, Paperclip, Sparkles, Globe, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const suggestedPrompts = [
  {
    icon: Sparkles,
    text: "How does AI work?",
    category: "create",
  },
  {
    icon: Globe,
    text: "Are black holes real?",
    category: "explore",
  },
  {
    icon: Code,
    text: 'How many Rs are in the word "strawberry"?',
    category: "code",
  },
  {
    icon: BookOpen,
    text: "What is the meaning of life?",
    category: "learn",
  },
];

const categories = [
  { name: "Create", icon: Sparkles },
  { name: "Explore", icon: Globe },
  { name: "Code", icon: Code },
  { name: "Learn", icon: BookOpen },
];

export function ChatMain() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            How can I help you, Shyam?
          </h1>
        </div>

        {/* Category buttons */}
        <div className="flex gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card hover:bg-accent border-border"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Suggested prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {suggestedPrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <button
                key={index}
                className="p-4 text-left rounded-xl border border-border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <span className="text-foreground">{prompt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom input area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto p-4">
          <div className="relative">
            <div className="flex items-end gap-2 p-3 rounded-2xl border border-border bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <div className="flex-1">
                <Input
                  placeholder="Type your message here..."
                  className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                size="icon"
                className="h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-xs">
                GPT-5 mini
              </Badge>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                Low
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Search
              </span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                <Paperclip className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs rounded-full"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs rounded-full"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">C</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
