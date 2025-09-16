"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Compass,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface GreetingProps {
  onSelectSuggestion: (text: string) => void;
}

const tabs = [
  { key: "Create", icon: Sparkles, label: "Create" },
  { key: "Explore", icon: Compass, label: "Explore" },
  { key: "Code", icon: Code2, label: "Code" },
  { key: "Learn", icon: GraduationCap, label: "Learn" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const suggestionsByTab: Record<TabKey, string[]> = {
  Create: [
    "Write a short story about a robot discovering emotions",
    "Create a character profile for a complex villain with sympathetic motives",
    "Compose a poem about rain on a neon-lit city at night",
    "Draft an elevator pitch for a time-travel app",
  ],
  Explore: [
    "Help me outline a sci‑fi novel set in a post‑apocalyptic world",
    "What are the key themes in cyberpunk literature?",
    "Compare the philosophies of Stoicism and Buddhism",
    "Explain quantum entanglement like I'm five",
  ],
  Code: [
    "Refactor this function for readability in TypeScript",
    "Write a unit test for a React hook using React Testing Library",
    "Explain the difference between useMemo and useCallback",
    "Optimize a Next.js route handler for streaming responses",
  ],
  Learn: [
    "Give me 5 creative writing prompts for flash fiction",
    "Teach me binary search with a step‑by‑step example",
    "Summarize the HTTP/2 protocol in simple terms",
    "How do databases use indexes to speed up queries?",
  ],
};

export const Greeting = ({ onSelectSuggestion }: GreetingProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("Create");

  return (
    <div
      key="overview"
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="font-semibold text-xl md:text-2xl"
      >
        How can I help you, Shyam?
      </motion.div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`max-w-full mt-2 bg-accent text-primary-foreground ${
                isActive ? "bg-primary/20" : "hover:bg-accent/50"
              }
              `}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Suggestions list */}
      <div className="mt-6 space-y-3">
        {suggestionsByTab[activeTab].map((text) => (
          <motion.button
            key={text}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelectSuggestion(text)}
            className="w-full text-left px-4 py-2 rounded-xl hover:bg-accent/20 text-white/90 hover:text-white transition-colors"
          >
            {text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const Greeting2 = ({ onSelectSuggestion }: GreetingProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("Create");

  return (
    <div className="mx-auto mt-4 flex size-full max-w-4xl flex-col justify-center px-4 md:mt-16 md:px-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
          How can I help you, Shyam?
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Choose a category below to get started with tailored suggestions
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {tabs.map(({ key, icon: Icon, label }) => {
            const isActive = key === activeTab;
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 px-4 py-2 transition-all duration-200
                  ${isActive ? "shadow-sm" : "hover:bg-background/50"}
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Active Tab Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex justify-center mb-6"
      >
        <Badge variant="secondary" className="text-xs font-medium">
          {activeTab} suggestions
        </Badge>
      </motion.div>

      {/* Suggestions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-3 md:grid-cols-2"
      >
        {suggestionsByTab[activeTab].map((text, index) => (
          <motion.div
            key={`${activeTab}-${text}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5 + index * 0.1,
              ease: "easeOut",
            }}
          >
            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 hover:border-border bg-card/30 backdrop-blur-sm">
              <CardContent
                className="p-4"
                onClick={() => onSelectSuggestion(text)}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-relaxed text-card-foreground group-hover:text-foreground transition-colors">
                    {text}
                  </p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-0.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Separator className="my-8 opacity-30" />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center"
      >
        <p className="text-xs text-muted-foreground">
          Or ask me anything else — I'm here to help!
        </p>
      </motion.div>
    </div>
  );
};
