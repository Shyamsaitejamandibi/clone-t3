"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { useRouter } from "next/navigation";

export function ChatHeader() {
  const router = useRouter();
  return (
    <div className="fixed top-2.5 right-2.5 z-30 flex items-center ">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
        onClick={() => {
          router.push("/settings/customization");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="10" y1="6" x2="20" y2="6" />
          <line x1="4" y1="16" x2="14" y2="16" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </Button>
      <ModeToggle />
    </div>
  );
}
