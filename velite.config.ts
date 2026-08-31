import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      description: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      published: s.boolean().default(false),
      slug: s.path(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.slug.replace(/^posts\//, ""),
    })),
});

export default defineConfig({
  collections: { posts },
  mdx: {
    rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
  },
});
