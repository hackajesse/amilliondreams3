import { defineCollection } from "astro:content";
import { htmlPostsLoader } from "@blog-cms/astro";
import { site } from "./blog/site.ts";

const posts = defineCollection({
  loader: htmlPostsLoader({ base: site.postsDirectory }),
});

export const collections = { posts };
