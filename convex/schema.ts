import { StreamIdValidator } from "@convex-dev/persistent-text-streaming";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),

  chats: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("byUserId", ["userId"]),

  messages: defineTable({
    // chatId: v.id("chats"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.array(
      v.union(
        v.object({
          type: v.literal("text"),
          text: v.string(),
        }),
        v.object({
          type: v.literal("reasoning"),
          text: v.string(),
        })
      )
    ),
  }), // Add index for efficient chat-message lookup
});
