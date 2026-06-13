import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    slug: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    videoStorageId: v.optional(v.id("_storage")),
  })
    .index("by_slug", ["slug"])
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_body", {
      searchField: "body",
    }),
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    authorName: v.string(),
    body: v.string(),
  }),
});
