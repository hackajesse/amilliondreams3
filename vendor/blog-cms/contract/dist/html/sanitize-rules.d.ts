import { type ElementNode } from "./model.ts";
export declare const DROPPED_WITH_CONTENT: Set<string>;
export declare const BLOCK_WRAPPERS: Set<string>;
export declare const HEADING_MAP: Record<string, string>;
export declare const STRONG = "strong";
export declare const EM = "em";
export declare function isDropped(node: ElementNode): boolean;
export declare function marksFor(node: ElementNode): string[] | null;
export declare function cleanHref(href: string | undefined): string | undefined;
