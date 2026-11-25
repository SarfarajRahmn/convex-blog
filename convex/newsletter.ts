import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;

/**
 * Add an email address to the newsletter list. Anyone can call this, so the
 * address is validated here and not only in the form.
 *
 * A repeat signup succeeds without adding a second row, and returns the same
 * result as a new one, so this can't be used to check who is subscribed.
 *
 * There is deliberately no public query that lists subscribers. View them in
 * the Convex dashboard.
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
      throw new ConvexError("Please enter a valid email");
    }

    // Mutations are transactions, so two requests can't both insert.
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) {
      await ctx.db.insert("subscribers", { email });
    }

    return null;
  },
});
