"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";
import { PreviewMessage } from "./message";
import { ChatMessage } from "@/lib/types";

const dummyMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    parts: [
      {
        type: "text",
        text: "Hello! I'm working on a complex web application using Next.js, TypeScript, and Tailwind CSS. I've been struggling with implementing a real-time chat system that needs to handle multiple users, message persistence, and file uploads. Could you help me understand the best practices for architecting such a system?",
      },
    ],
    metadata: { createdAt: new Date().toISOString() },
  },
  {
    id: "2",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I'd be happy to help you build a real-time chat system! For a robust chat application with Next.js and TypeScript, you'll want to consider several key architectural components:\n\n1. **Real-time Communication**: Use WebSockets or Server-Sent Events (SSE) for live messaging. Socket.io is a popular choice that provides fallbacks and room management.\n\n2. **Database Design**: Structure your data with separate tables for users, conversations, messages, and file attachments. Consider using PostgreSQL with Prisma ORM for type safety.\n\n3. **File Upload Strategy**: Implement secure file uploads with size limits, type validation, and cloud storage (AWS S3, Cloudinary). Use presigned URLs for direct client uploads.\n\n4. **State Management**: For complex chat state, consider Zustand or Redux Toolkit to manage messages, typing indicators, and user presence.\n\n5. **Authentication**: Implement proper user authentication with JWT tokens and refresh token rotation.\n\nWould you like me to dive deeper into any of these areas?",
      },
    ],
    metadata: { createdAt: new Date().toISOString() },
  },
  {
    id: "3",
    role: "user",
    parts: [
      {
        type: "text",
        text: "That's really helpful! I'm particularly interested in the real-time communication aspect. How would you implement WebSocket connections in a Next.js application? I've heard about using custom servers vs API routes, but I'm not sure which approach would be better for my use case. Also, how do you handle connection reliability and reconnection logic when users have unstable internet connections?",
      },
    ],
    metadata: { createdAt: new Date().toISOString() },
  },
  {
    id: "4",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Great question! For WebSocket implementation in Next.js, you have a few solid options:\n\n**Custom Server Approach (Recommended for complex chat):**\n```javascript\nconst { createServer } = require('http');\nconst { parse } = require('url');\nconst next = require('next');\nconst { Server } = require('socket.io');\n\nconst dev = process.env.NODE_ENV !== 'production';\nconst app = next({ dev });\nconst handle = app.getRequestHandler();\n\napp.prepare().then(() => {\n  const server = createServer((req, res) => {\n    const parsedUrl = parse(req.url, true);\n    handle(req, res, parsedUrl);\n  });\n\n  const io = new Server(server);\n  \n  io.on('connection', (socket) => {\n    socket.on('join-room', (roomId) => {\n      socket.join(roomId);\n    });\n    \n    socket.on('send-message', (data) => {\n      io.to(data.roomId).emit('new-message', data);\n    });\n  });\n\n  server.listen(3000);\n});\n```\n\n**Connection Reliability Strategies:**\n1. **Exponential Backoff**: Gradually increase reconnection delays\n2. **Heartbeat/Ping-Pong**: Regular connection health checks\n3. **Queue Offline Messages**: Store messages locally and sync when reconnected\n4. **Connection State UI**: Show connection status to users\n\nSocket.io handles most reliability concerns automatically, including automatic reconnection and transport fallbacks (WebSocket → polling).",
      },
    ],
    metadata: { createdAt: new Date().toISOString() },
  },
];

export function ChatMain() {
  const [messages, setMessages] = useState<ChatMessage[]>(dummyMessages);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      parts: [{ type: "text", text: message }],
      role: "user",
      metadata: { createdAt: new Date().toISOString() },
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
              <PreviewMessage
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
