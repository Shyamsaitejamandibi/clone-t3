"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMain } from "@/components/chat-main";
import { Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function ChatContent() {
  return (
    <div className="flex h-screen w-full  relative">
      <div className="absolute top-3 left-3 z-50">
        <SidebarTrigger className="h-8 w-8 hover:cursor-pointer text-white" />
      </div>
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header icons positioned exactly as in the image */}
        <div className="fixed top-3 right-3 z-30 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
          >
            <Sun className="w-4 h-4" />
          </Button>
        </div>

        {/* Main content */}
        <ChatMain />
      </div>
    </div>
  );
}

export function ChatLayout() {
  return <ChatContent />;
}
