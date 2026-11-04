import { defineConfig } from 'astro/config';
import { site } from './src/blog/site.ts';

const feed = new URL('./src/endpoints/feed.ts', import.meta.url);
const sitemap = new URL('./src/endpoints/sitemap.ts', import.meta.url);

export default defineConfig({
  output: 'static',
  site: 'https://amilliondreams.llc',
  trailingSlash: 'always',
  integrations: [
    {
      name: 'site-files',
      hooks: {
        'astro:config:setup': ({ injectRoute }) => {
          injectRoute({ pattern: site.feedPath, entrypoint: feed, prerender: true });
          injectRoute({ pattern: site.sitemapPath, entrypoint: sitemap, prerender: true });
        },
      },
    },
  ],
});
