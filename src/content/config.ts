import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string() || z.date(),
    readTime: z.string(),
    tags: z.array(z.string()),
    excerpt: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};
