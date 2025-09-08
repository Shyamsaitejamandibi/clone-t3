import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createThread = internalMutation({
  args: {
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
    const { role, parts } = args;
    const thread = await ctx.db.insert("messages", {
      role,
      parts,
    });
    return thread;
  },
});
