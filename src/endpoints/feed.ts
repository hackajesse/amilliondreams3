import rss from "@astrojs/rss";
import { descriptionFor } from "@blog-cms/contract";
import { postPath } from "@blog-cms/astro";
import { publishedPosts } from "../lib/posts.ts";
import { site } from "../blog/site.ts";

export async function GET(): Promise<Response> {
  const posts = await publishedPosts();
  return rss({
    title: site.name,
    description: `${site.name}, by ${site.authorName}.`,
    site: site.url,
    trailingSlash: true,
    items: posts.map((post) => {
      const publishDate = post.data.publishDate;
      if (typeof publishDate !== "string" || publishDate === "") {
        throw new Error(`Published post ${String(post.id)} is missing publishDate.`);
      }
      const tags = Array.isArray(post.data.tags) ? post.data.tags.filter((tag) => typeof tag === "string") : [];
      return {
        title: String(post.data.title),
        description: descriptionFor({ description: stringField(post.data.description) }, stringField(post.body)),
        pubDate: new Date(publishDate),
        link: postPath(site.permalink, String(post.id), publishDate, site.timezone),
        categories: tags,
      };
    }),
  });
}

function stringField(value: unknown): string {
  return typeof value === "string" ? value : "";
}
