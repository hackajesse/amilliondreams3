import type { HeadPost, SiteSettings } from "./types.ts";
import { absoluteUrl, postPath } from "./urls.ts";
export { absoluteUrl, postPath };
export type { HeadPost, SiteSettings } from "./types.ts";
export interface HeadModel {
    title: string;
    description: string;
    canonical: string;
    noindex: boolean;
    image: string;
    imageAlt: string;
    publishedTime: string;
    modifiedTime: string;
    tags: readonly string[];
    siteName: string;
    jsonLd: string;
}
export declare function headModel(post: HeadPost, site: SiteSettings): HeadModel;
