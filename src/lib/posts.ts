import { getCollection } from "astro:content";
import { getPublishedPosts } from "@blog-cms/astro";
import { slugify } from "@blog-cms/contract";

export interface CollectionPost {
  id: string;
  body?: string;
  data: {
    status: string;
    title: string;
    publishDate?: string;
    updatedDate?: string;
    description?: string;
    tags?: string[];
    categories?: string[];
    seoTitle?: string;
    image?: string;
    imageAlt?: string;
    noindex?: boolean;
    canonical?: string;
  };
}

function isCollectionPost(value: unknown): value is CollectionPost {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || typeof value.id !== "string") return false;
  if (!("data" in value) || typeof value.data !== "object" || value.data === null) return false;
  const data = value.data;
  if (!("status" in data) || typeof data.status !== "string") return false;
  if (!("title" in data) || typeof data.title !== "string") return false;
  return true;
}

export async function publishedPosts(): Promise<CollectionPost[]> {
  const entries: unknown = await getCollection("posts");
  if (!Array.isArray(entries)) throw new Error("Posts collection did not return a list.");
  return getPublishedPosts(
    entries.map((entry) => {
      if (!isCollectionPost(entry)) throw new Error("A post entry is missing an id, title, or status.");
      return entry;
    }),
  );
}

export interface TermGroup<T> {
  name: string;
  slug: string;
  posts: T[];
}

interface TermSource {
  data: { tags?: readonly string[]; categories?: readonly string[] };
}

export function groupByTerm<T extends TermSource>(posts: readonly T[], field: "tags" | "categories"): TermGroup<T>[] {
  const grouped = new Map<string, T[]>();
  for (const post of posts) {
    for (const name of post.data[field] ?? []) {
      const list = grouped.get(name);
      if (list) list.push(post);
      else grouped.set(name, [post]);
    }
  }

  const seen = new Set<string>();
  const groups: TermGroup<T>[] = [];
  for (const name of [...grouped.keys()].sort((left, right) => left.localeCompare(right))) {
    const slug = slugify(name);
    if (seen.has(slug)) throw new Error(`"${name}" slugifies to "${slug}", which is already used.`);
    seen.add(slug);
    groups.push({ name, slug, posts: grouped.get(name) ?? [] });
  }
  return groups;
}

export function termSlug(name: string): string {
  return slugify(name);
}
