import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { generateUUID } from "@/lib/utils";

export const getChatId = query({
  args: {
    id: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();
    const chat = await ctx.db
      .query("chats")
      .filter((q) =>
        q.and(q.eq(q.field("id"), args.id), q.eq(q.field("userId"), user?._id))
      )
      .first();
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat._id;
  },
});

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
    response: v.optional(
      v.object({
        modelName: v.string(),
        tokens: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { role, parts, chatId, response } = args;
    const thread = await ctx.db.insert("messages", {
      chatId,
      role,
      parts,
      response,
    });
    return thread;
  },
});

export const getInitialMessages = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("id"), args.chatId))
      .first();
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chatId?._id))
      .collect();
    return messages.map(({ _creationTime, ...message }) => message);
  },
});

export const userThreads = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();
    const chats = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), userId?._id))
      .order("desc")
      .collect();
    return chats;
  },
});

export const pinThread = mutation({
  args: { threadId: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, { pinned: true });
  },
});

export const unpinThread = mutation({
  args: { threadId: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, { pinned: false });
  },
});

export const deleteThread = mutation({
  args: { threadId: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.threadId);
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.threadId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const createBranch = mutation({
  args: {
    parentThreadId: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const parentThread = await ctx.db.get(args.parentThreadId);
    if (!parentThread) throw new Error("Parent thread not found");

    const id = generateUUID();
    const branchId = await ctx.db.insert("chats", {
      userId: parentThread.userId,
      title: args.title,
      pinned: false,
      isBranch: true,
      branchOf: args.parentThreadId,
      id,
    });

    // Copy all messages from the parent thread to the new branch
    const parentMessages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.parentThreadId))
      .collect();

    for (const message of parentMessages) {
      await ctx.db.insert("messages", {
        chatId: branchId,
        role: message.role,
        parts: message.parts,
        response: message.response,
      });
    }

    return id;
  },
});

export const createChat = mutation({
  args: {
    id: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Creating chat with ID:", args.id, "for userId:", args.userId);
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();
    const chat = await ctx.db.insert("chats", {
      userId: user?._id!,
      title: "New Chat",
      pinned: false,
      id: args.id,
    });
    return chat;
  },
});
