"use client";

import React from "react";
import {
  Send,
  Paperclip,
  Sparkles,
  Globe,
  Code,
  BookOpen,
  ChevronDown,
  Search,
  Info,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ChatMain() {
  const [message, setMessage] = React.useState("");
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Main content area */}

      {/* Bottom input area */}
      <div className="w-full max-w-3xl mx-auto -my-4 px-0">
        {/* Chat Input Container */}
        <div className=" border rounded-lg p-4 flex flex-col gap-2">
          {/* Message Input and Send Button Row */}
          <div className="flex items-center gap-2 w-full">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 !bg-transparent border-none text-slate-300 placeholder:text-slate-500 text-base h-auto pb-5 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 p-1 h-auto font-normal text-sm whitespace-nowrap"
                  >
                    GPT-5 mini
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700">
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                    GPT-5 mini
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
                    GPT-4
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Low Button */}
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700 p-1 h-auto font-normal text-sm whitespace-nowrap"
              >
                <Info className="mr-1 h-3 w-3" />
                Low
              </Button>

              {/* Search Button */}
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700 p-1 h-auto font-normal text-sm whitespace-nowrap"
              >
                <Search className="mr-1 h-3 w-3" />
                Search
              </Button>

              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white hover:bg-slate-700 h-8 w-8 flex-shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="icon"
              className="bg-purple-600 hover:bg-purple-700 h-10 w-10 rounded-md flex-shrink-0 ml-2"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
