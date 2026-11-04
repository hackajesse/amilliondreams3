import { type BodyNode, type ElementNode } from "./model.ts";
export declare function serializeElement(node: ElementNode): string;
export declare function serializeBody(nodes: readonly BodyNode[]): string;
export declare function normalizeBody(html: string): string;
