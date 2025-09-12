"use client";
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  GitBranch,
  Trash2,
  PinOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface ChatThread {
  _id: Id<"chats">;
  _creationTime: number;
  isBranch?: boolean;
  branchOf?: Id<"chats">;
  id: string;
  userId: Id<"users">;
  title: string;
  pinned: boolean;
}

export function ChatSidebar() {
  const { open } = useSidebar();
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<ChatThread | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const chatThreads = useQuery(api.threads.userThreads, {
    userId: userId!,
  }) as ChatThread[] | undefined;

  // Optimistic mutations
  const pinThread = useMutation(api.threads.pinThread).withOptimisticUpdate(
    (localStore, args) => {
      if (!userId) return;
      const current = localStore.getQuery(api.threads.userThreads, { userId });
      if (current) {
        const updated = current.map((t: ChatThread) =>
          t._id === args.threadId ? { ...t, pinned: true } : t
        );
        localStore.setQuery(api.threads.userThreads, { userId }, updated);
      }
    }
  );

  const unpinThread = useMutation(api.threads.unpinThread).withOptimisticUpdate(
    (localStore, args) => {
      if (!userId) return;
      const current = localStore.getQuery(api.threads.userThreads, { userId });
      if (current) {
        const updated = current.map((t: ChatThread) =>
          t._id === args.threadId ? { ...t, pinned: false } : t
        );
        localStore.setQuery(api.threads.userThreads, { userId }, updated);
      }
    }
  );

  const deleteThread = useMutation(
    api.threads.deleteThread
  ).withOptimisticUpdate((localStore, args) => {
    if (!userId) return;
    const current = localStore.getQuery(api.threads.userThreads, { userId });
    if (current) {
      const updated = current.filter(
        (t: ChatThread) => t._id !== args.threadId
      );
      localStore.setQuery(api.threads.userThreads, { userId }, updated);
    }
  });

  const filteredThreads =
    chatThreads?.filter((thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const pinnedThreads = filteredThreads
    .filter((thread) => thread.pinned)
    .sort((a, b) => b._creationTime - a._creationTime);
  const unpinnedThreads = filteredThreads.filter((thread) => !thread.pinned);

  const todayThreads = unpinnedThreads
    .filter((thread) => thread._creationTime >= Date.now() - 86400000)
    .sort((a, b) => b._creationTime - a._creationTime);
  const olderThreads = unpinnedThreads
    .filter((thread) => thread._creationTime < Date.now() - 86400000)
    .sort((a, b) => b._creationTime - a._creationTime);

  const handlePinToggle = async (thread: ChatThread) => {
    try {
      if (thread.pinned) {
        await unpinThread({ threadId: thread._id });
      } else {
        await pinThread({ threadId: thread._id });
      }
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleDeleteClick = (thread: ChatThread) => {
    setThreadToDelete(thread);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (threadToDelete) {
      try {
        await deleteThread({ threadId: threadToDelete._id });
        setDeleteDialogOpen(false);
        setThreadToDelete(null);

        // Navigate away if currently viewing deleted thread
        if (pathname === `/chat/${threadToDelete.id}`) {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
  };

  const ThreadItem = ({
    thread,
    showBranchIndicator = false,
  }: {
    thread: ChatThread;
    showBranchIndicator?: boolean;
  }) => (
    <SidebarMenu key={thread.id}>
      <SidebarMenuItem>
        <div className="flex items-center group">
          <SidebarMenuButton
            className={`flex-1 justify-start text-left hover:bg-sidebar-accent rounded-lg ${
              thread.pinned ? "bg-primary/10 border border-primary/20" : ""
            }`}
            onClick={() => router.push(`/chat/${thread.id}`)}
          >
            {showBranchIndicator && thread.isBranch && (
              <GitBranch className="w-3 h-3 mr-1 text-muted-foreground" />
            )}
            <span className="truncate text-sm flex-1">{thread.title}</span>

            <div className="flex items-center gap-1 ml-1 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                aria-label={thread.pinned ? "Unpin thread" : "Pin thread"}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinToggle(thread);
                }}
              >
                {thread.pinned ? (
                  <PinOff className="w-3 h-3" />
                ) : (
                  <Pin className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                aria-label="Delete thread"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(thread);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  console.log("Chat threads:", chatThreads);

  return (
    <>
      <div className="fixed top-3 left-3 z-50">
        <SidebarTrigger className="h-8 w-8 hover:cursor-pointer text-white" />
        {!open && (
          <div className="fixed top-3 left-12 z-30 flex items-center gap-2">
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

      <Sidebar className="w-64 border-r border-border bg-sidebar-accent">
        <SidebarHeader className="px-4 py-3">
          <div className="flex items-center justify-center">
            <span className="font-semibold text-sidebar-foreground text-lg">
              T3.chat
            </span>
          </div>
          <Button
            className="max-w-full mt-2 bg-primary/20 text-primary-foreground"
            onClick={() => {
              if (pathname.includes("/chat/")) {
                router.push("/");
              }
            }}
          >
            New Chat
          </Button>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 !bg-transparent placeholder:text-sm placeholder:text-muted-foreground/50 placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-sidebar-accent rounded-none text-2xl focus:bg-transparent focus:border-b-2 focus-visible:border-b-2 focus-visible:border-sidebar-accent"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <ScrollArea className="flex-1 h-0">
            <div className="space-y-1">
              {pinnedThreads.length > 0 && (
                <>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </div>
                  {pinnedThreads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      showBranchIndicator
                    />
                  ))}
                </>
              )}

              {todayThreads.length > 0 && (
                <>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Today
                  </div>
                  {todayThreads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      showBranchIndicator
                    />
                  ))}
                </>
              )}

              {olderThreads.length > 0 && (
                <>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Previous
                  </div>
                  {olderThreads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      showBranchIndicator
                    />
                  ))}
                </>
              )}

              {filteredThreads.length === 0 && (
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  {searchQuery ? "No matching threads" : "No threads found"}
                </div>
              )}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
            <UserButton
              showName
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "bg-background border border-border",
                  userButtonPopoverActionButton: "hover:bg-accent",
                },
              }}
            />
          </div>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {threadToDelete?.title}? This
              action cannot be undone.
              {threadToDelete?.isBranch &&
                " This will also delete any branches created from this thread."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
