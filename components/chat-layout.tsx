"use client";

import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMain } from "@/components/chat-main";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function ChatContent() {
  const { open } = useSidebar();

  return (
    <div className="flex h-screen w-full bg-background relative">
      {/* Always visible trigger and conditional icons */}
      <div className="absolute top-3 left-3 z-50 flex items-center gap-1">
        <SidebarTrigger className="h-8 w-8 hover:cursor-pointer " />
        {!open && (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      <ChatSidebar />
      <ChatMain />
    </div>
  );
}

export function ChatLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <ChatContent />
    </SidebarProvider>
  );
}
