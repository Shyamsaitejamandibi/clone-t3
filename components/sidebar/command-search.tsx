"use client";

import * as React from "react";
import { Clock, Search, X } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

export function CommandSearch({
  userId,
  showButton = true,
}: {
  userId: string;
  showButton?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const router = useRouter();
  const recentChats = useQuery(api.threads.userThreads, {
    userId: userId!,
  });

  const filteredChats = React.useMemo(() => {
    const all = recentChats ?? [];
    if (!query) return all;
    const q = query.toLowerCase();
    const filtered = all.filter((t) => t.title.toLowerCase().includes(q));
    return filtered.length ? filtered : all;
  }, [query, recentChats]);

  // Handle keyboard shortcut to open the command dialog
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {showButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
          onClick={() => setOpen(true)}
        >
          <Search className="w-4 h-4" />
        </Button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="rounded-xl"
        shouldFilter={false}
      >
        <div>
          <div className="relative">
            <CommandInput
              placeholder="Search or press Enter to start new chat..."
              value={query}
              onValueChange={setQuery}
              className="flex w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="px-4">
            <CommandSeparator />
          </div>
          <CommandList className="max-h-[375px] overflow-hidden">
            <ScrollArea className="h-[350px] m-2">
              <CommandGroup className="px-4">
                <div className="flex items-center justify-start">
                  <Clock className="size-3 mr-2 text-chart-1" />
                  <h1 className="text-sm font-normal pb-1 text-chart-1">
                    Recent Chats
                  </h1>
                </div>
                {filteredChats.map((title) => (
                  <CommandItem
                    key={title._id}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/chat/${title.id}`);
                    }}
                    className="rounded-lg h-9 hover:bg-accent/20 hover:text-accent-foreground data-[selected=true]:!bg-accent/20 data-[selected=true]:text-accent-foreground transition-colors"
                  >
                    <span>{title.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </div>
      </CommandDialog>
    </div>
  );
}
