"use client";

import React from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMain } from "@/components/chat-main";
import { Plus, Search, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatLayout() {
  const { open } = useSidebar();
  return (
    <div className="flex h-screen w-full  relative">
      <div className="fixed top-3 left-3 z-50">
        <SidebarTrigger className="h-8 w-8 hover:cursor-pointer text-white" />
        {!open && (
          <div className="fixed top-3 left-12 z-30 flex items-center gap-2">
            {/* Header icons positioned exactly as in the image */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
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
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          <ChatMain />
        </div>
      </div>
    </div>
  );
}
