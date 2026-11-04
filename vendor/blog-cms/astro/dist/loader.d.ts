import type { Loader } from "astro/loaders";
export interface HtmlPostsLoaderOptions {
    /** Directory of `.html` posts. Absolute, a file URL, or relative to the project root. */
    base: string | URL;
}
export declare function htmlPostsLoader(options: HtmlPostsLoaderOptions): Loader;
