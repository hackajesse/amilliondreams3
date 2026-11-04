export declare const FALLBACK_SLUG = "untitled";
export declare function slugify(title: string): string;
export declare function uniqueSlug(base: string, existing: Iterable<string>): string;
export declare function isValidSlug(slug: string): boolean;
