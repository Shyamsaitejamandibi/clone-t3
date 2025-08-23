"use client";
import { MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

const chatThreads = [
  {
    id: 1,
    title: "Excluding .env.example from ...",
    isToday: true,
  },
  {
    id: 2,
    title: "Generate a long story",
    isToday: true,
  },
  {
    id: 3,
    title: "JS Engine vs Runtime",
    isToday: true,
  },
];

export function ChatSidebar() {
  return (
    <Sidebar className="w-64 border-r border-border bg-sidebar-accent">
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center justify-center">
          <span className="font-semibold text-sidebar-foreground text-lg">
            T3.chat
          </span>
        </div>
        <Button className="max-w-full mt-2 bg-primary/20 text-primary-foreground">
          New Chat
        </Button>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your threads..."
              className="pl-8 !bg-transparent placeholder:text-sm placeholder:text-muted-foreground/50 placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-sidebar-accent rounded-none text-2xl focus:bg-transparent focus:border-b-2 focus-visible:border-b-2 focus-visible:border-sidebar-accent"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1">
            Today
          </div>
          {chatThreads
            .filter((thread) => thread.isToday)
            .map((thread) => (
              <SidebarMenu key={thread.id}>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full justify-start text-left hover:bg-sidebar-accent rounded-lg">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="truncate text-sm">{thread.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <UserButton showName />
      </SidebarFooter>
    </Sidebar>
  );
}
