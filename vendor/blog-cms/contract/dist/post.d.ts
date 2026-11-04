import type { Post } from "./frontmatter/types.ts";
export declare const FRONTMATTER_DELIMITER = "---";
export declare function parsePost(text: string): Post;
export declare function serializePost(post: Post): string;
