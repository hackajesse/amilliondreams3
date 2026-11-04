import { absoluteUrl, modifiedDate, postPath } from "@blog-cms/astro";
import { publishedPosts } from "../lib/posts.ts";
import { sitemapXml, type SitemapEntry } from "../lib/sitemap.ts";
import { site } from "../blog/site.ts";

export async function GET(): Promise<Response> {
  const posts = await publishedPosts();
  const entries: SitemapEntry[] = [
    { loc: absoluteUrl(site.url, "/") },
    { loc: absoluteUrl(site.url, "/blog/") },
    ...posts.map((post) => ({
      loc: absoluteUrl(site.url, postPath(site.permalink, String(post.id), stringField(post.data.publishDate), site.timezone)),
      lastmod: modifiedDate({
        updatedDate: stringField(post.data.updatedDate),
        publishDate: stringField(post.data.publishDate),
      }),
    })),
  ];
  return new Response(sitemapXml(entries), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

function stringField(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}
