export declare const LOCKED_PLACEHOLDER_ATTRIBUTE = "data-locked-block";
export interface PlaceholderBody {
    body: string;
    blocks: string[];
}
export declare function lockedBlockPlaceholder(index: number): string;
export declare function extractLockedBlocks(body: string): string[];
export declare function extractLockedInnerHtml(body: string): string[];
export declare function lockedBlockPlaceholders(body: string): PlaceholderBody;
export declare function restoreLockedBlocks(body: string, blocks: readonly string[]): string;
export declare function findNewLockedBlocks(body: string, storedBody: string): string[];
