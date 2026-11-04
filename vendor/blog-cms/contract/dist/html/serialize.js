import { escapeText } from "./escape.js";
import { serializeInlineRun } from "./inline.js";
import { closeTag, isVoid, openTag } from "./markup.js";
import { isInlineNode, isWhitespaceText, parseBody } from "./model.js";
import { BLOCK_CONTAINER_ELEMENTS, RAW_TEXT_ELEMENTS, STRUCTURAL_ELEMENTS, TEXTBLOCK_ELEMENTS } from "./tags.js";
const TOP_LEVEL_SEPARATOR = "\n";
const NESTED_SEPARATOR = "";
const PARAGRAPH = "p";
function hasContent(run) {
    return run.some((node) => !isWhitespaceText(node));
}
function serializeBlocks(nodes, separator) {
    const out = [];
    let run = [];
    const flush = () => {
        if (hasContent(run))
            out.push(`<${PARAGRAPH}>${serializeInlineRun(run, serializeElement)}</${PARAGRAPH}>`);
        run = [];
    };
    for (const node of nodes) {
        if (isInlineNode(node)) {
            run.push(node);
            continue;
        }
        flush();
        out.push(serializeNode(node, false));
    }
    flush();
    return out.join(separator);
}
function serializeNode(node, rawText) {
    if (node.kind === "locked")
        return node.source;
    if (node.kind === "text")
        return rawText ? node.value : escapeText(node.value);
    return serializeElement(node);
}
function serializeChildren(node) {
    const { tag, children } = node;
    if (TEXTBLOCK_ELEMENTS.has(tag))
        return serializeInlineRun(children, serializeElement);
    if (BLOCK_CONTAINER_ELEMENTS.has(tag))
        return serializeBlocks(children, NESTED_SEPARATOR);
    if (STRUCTURAL_ELEMENTS.has(tag)) {
        return children
            .filter((child) => !isWhitespaceText(child))
            .map((child) => serializeNode(child, false))
            .join("");
    }
    const rawText = RAW_TEXT_ELEMENTS.has(tag);
    return children.map((child) => serializeNode(child, rawText)).join("");
}
export function serializeElement(node) {
    if (isVoid(node))
        return openTag(node);
    return openTag(node) + serializeChildren(node) + closeTag(node);
}
export function serializeBody(nodes) {
    return serializeBlocks(nodes, TOP_LEVEL_SEPARATOR);
}
export function normalizeBody(html) {
    return serializeBody(parseBody(html));
}
