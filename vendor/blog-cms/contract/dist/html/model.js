import { parseFragment } from "parse5";
import { LOCKED_BLOCK_ATTRIBUTE, LOCKED_BLOCK_CLOSE_TAG, LOCKED_BLOCK_OPEN_TAG } from "./allowed.js";
import { INLINE_ELEMENTS } from "./tags.js";
export function element(tag, attrs = [], children = []) {
    return { kind: "element", tag, attrs, children };
}
export function text(value) {
    return { kind: "text", value };
}
export function getAttr(node, name) {
    return node.attrs.find(([attrName]) => attrName === name)?.[1];
}
export function isElement(node, tag) {
    return node.kind === "element" && (tag === undefined || node.tag === tag);
}
export function isInlineNode(node) {
    if (node.kind === "text")
        return true;
    return node.kind === "element" && INLINE_ELEMENTS.has(node.tag) && node.children.every(isInlineNode);
}
export function isWhitespaceText(node) {
    return node.kind === "text" && /^[ \t\n\r\f]*$/.test(node.value);
}
function isLockedSource(node) {
    return node.tagName === "div" && node.attrs.some((attr) => attr.name === LOCKED_BLOCK_ATTRIBUTE);
}
export function lockedNode(innerHtml) {
    return {
        kind: "locked",
        innerHtml,
        source: LOCKED_BLOCK_OPEN_TAG + innerHtml + LOCKED_BLOCK_CLOSE_TAG,
    };
}
function lockedSource(node, source) {
    const location = node.sourceCodeLocation;
    if (!location?.startTag)
        throw new Error("Locked block has no source location.");
    const innerEnd = location.endTag?.startOffset ?? location.endOffset;
    return lockedNode(source.slice(location.startTag.endOffset, innerEnd));
}
function attrName(attr) {
    return attr.prefix ? `${attr.prefix}:${attr.name}` : attr.name;
}
function convert(node, source, topLevel) {
    if (node.nodeName === "#text")
        return text(node.value);
    if (!("tagName" in node))
        return null;
    if (topLevel && isLockedSource(node))
        return lockedSource(node, source);
    const childNodes = node.tagName === "template" ? node.content.childNodes : node.childNodes;
    return element(node.tagName, node.attrs.map((attr) => [attrName(attr), attr.value]), convertAll(childNodes, source, false));
}
function convertAll(nodes, source, topLevel) {
    return nodes.flatMap((node) => convert(node, source, topLevel) ?? []);
}
export function parseBody(html) {
    const fragment = parseFragment(html, { sourceCodeLocationInfo: true });
    return convertAll(fragment.childNodes, html, true);
}
