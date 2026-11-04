import { type BodyNode, type ElementNode } from "./model.ts";
export type OpaqueSerializer = (node: ElementNode) => string;
export declare function serializeInlineRun(nodes: readonly BodyNode[], opaque: OpaqueSerializer): string;
