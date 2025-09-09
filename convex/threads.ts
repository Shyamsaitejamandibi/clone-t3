import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createThread = internalMutation({
  args: {
    chatId: v.id("chats"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    parts: v.array(
      v.object({
        type: v.union(v.literal("text"), v.literal("reasoning")),
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { role, parts, chatId } = args;
    const thread = await ctx.db.insert("messages", {
      chatId,
      role,
      parts,
    });
    return thread;
  },
});

export const getIntialMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();
    // Exclude _creationTime from the returned messages
    return messages.map(({ _creationTime, ...message }) => message);
  },
});

export const validChatID = query({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("_id"), args.chatId))
      .first();
    if (!chat) {
      throw new Error("Chat not found");
    }
    if (chat.userId !== args.userId) {
      throw new Error("User is not authorized to access this chat");
    }
    return true;
  },
});
