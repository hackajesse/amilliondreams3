export type Attribute = readonly [name: string, value: string];
export interface ElementNode {
    kind: "element";
    tag: string;
    attrs: Attribute[];
    children: BodyNode[];
}
export interface TextNode {
    kind: "text";
    value: string;
}
export interface LockedNode {
    kind: "locked";
    source: string;
    innerHtml: string;
}
export type BodyNode = ElementNode | TextNode | LockedNode;
export declare function element(tag: string, attrs?: Attribute[], children?: BodyNode[]): ElementNode;
export declare function text(value: string): TextNode;
export declare function getAttr(node: ElementNode, name: string): string | undefined;
export declare function isElement(node: BodyNode, tag?: string): node is ElementNode;
export declare function isInlineNode(node: BodyNode): boolean;
export declare function isWhitespaceText(node: BodyNode): boolean;
export declare function lockedNode(innerHtml: string): LockedNode;
export declare function parseBody(html: string): BodyNode[];
