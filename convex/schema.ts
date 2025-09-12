import { StreamIdValidator } from "@convex-dev/persistent-text-streaming";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),

  chats: defineTable({
    id: v.string(),
    userId: v.id("users"),
    title: v.string(),
    pinned: v.boolean(),
    isBranch: v.optional(v.boolean()),
    branchOf: v.optional(v.id("chats")),
  }).index("byUserId", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
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
    response: v.optional(
      v.object({
        modelName: v.string(),
        tokens: v.number(),
      })
    ),
  }),
});
