"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const dummyMessages: ChatMessage[] = [
  { id: "1", content: "Hello!", role: "user" },
  {
    id: "2",
    content: "Hi there! How can I help you today?",
    role: "assistant",
  },
  {
    id: "3",
    content:
      "I'm working on a React project and need help with state management.",
    role: "user",
  },
  {
    id: "4",
    content:
      "Great! React has several options for state management. For simple local state, useState is perfect. For more complex state, you might consider useReducer, Context API, or external libraries like Redux or Zustand. What specific challenges are you facing?",
    role: "assistant",
  },
  {
    id: "5",
    content:
      "I have a form with multiple inputs and I'm not sure how to handle validation.",
    role: "user",
  },
  {
    id: "6",
    content:
      "Form validation can be handled in several ways. You could use controlled components with useState, implement custom validation functions, or use libraries like React Hook Form or Formik. Here's a simple example with useState and validation:",
    role: "assistant",
  },
  {
    id: "7",
    content:
      "That's helpful! Can you show me how to implement real-time validation?",
    role: "user",
  },
  {
    id: "8",
    content:
      "Absolutely! Real-time validation can be implemented using onChange events. You can validate on every keystroke or use debouncing to improve performance. Would you like me to show you both approaches?",
    role: "assistant",
  },
  {
    id: "9",
    content: "Yes, please show me the debounced approach.",
    role: "user",
  },
  {
    id: "10",
    content:
      "Here's how you can implement debounced validation using useEffect and a custom hook. This approach waits for the user to stop typing before running validation, which is more efficient for expensive operations.",
    role: "assistant",
  },
  {
    id: "11",
    content:
      "This is exactly what I needed! How do I handle async validation like checking if an email already exists?",
    role: "user",
  },
  {
    id: "12",
    content:
      "For async validation, you'll want to use useEffect with async functions and handle loading states. You can also implement abort controllers to cancel previous requests when the input changes. Here's a pattern that works well for email validation.",
    role: "assistant",
  },
  {
    id: "13",
    content:
      "Perfect! One more question - how do I display validation errors in a user-friendly way?",
    role: "user",
  },
  {
    id: "14",
    content:
      "Great question! For user-friendly error display, consider: 1) Show errors near the relevant input field, 2) Use clear, actionable language, 3) Display errors after the user has interacted with the field, 4) Use visual cues like color and icons, 5) Provide suggestions for fixing errors when possible.",
    role: "assistant",
  },
  {
    id: "15",
    content: "Thank you so much! This has been incredibly helpful.",
    role: "user",
  },
  {
    id: "16",
    content:
      "You're very welcome! I'm glad I could help you with form validation in React. Feel free to ask if you have any more questions about React, TypeScript, or web development in general. Good luck with your project!",
    role: "assistant",
  },
];

export function ChatMain() {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);
  const id = "";

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-0">
        <div className="p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Start a conversation
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-card text-primary-foreground ml-12"
                      : "bg-muted mr-12"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
