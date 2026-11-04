import type { SiteSettings } from "@blog-cms/astro";

export const site = {
  name: "A Million Dreams",
  url: "https://amilliondreams.llc",
  authorName: "Jesse Biroscak",
  authorUrl: "https://amilliondreams.llc/",
  sameAs: [
    "https://www.linkedin.com/in/jessebiroscak/",
    "https://www.linkedin.com/company/a-million-dreams-llc/",
  ],
  // BaseLayout references /og-image.png, and that file is not in public/.
  // Posts without their own image use the hero banner, which is.
  defaultImage: "/hero-banner.jpg",
  titleTemplate: "{title} | A Million Dreams",
  timezone: "America/New_York",
  permalink: "/blog/{slug}/",
  feedPath: "/feed/",
  sitemapPath: "/sitemap.xml",
  // IndexNow is off. The key file route is not registered.
  indexNowKey: "",
  postsDirectory: "src/content/posts",
  pageSize: 10,
} satisfies SiteSettings;
