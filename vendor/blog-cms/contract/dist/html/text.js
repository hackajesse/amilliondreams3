import { parseBody } from "./model.js";
import { INLINE_ELEMENTS, RAW_TEXT_ELEMENTS } from "./tags.js";
export const DESCRIPTION_MAX_LENGTH = 155;
const ELLIPSIS = "…";
const SKIPPED_ELEMENTS = new Set(["figure", ...RAW_TEXT_ELEMENTS]);
const TRAILING_PUNCTUATION = /[\s,;:.\-–—]+$/;
function collectText(nodes, out) {
    for (const node of nodes) {
        if (node.kind === "text")
            out.push(node.value);
        if (node.kind !== "element" || SKIPPED_ELEMENTS.has(node.tag))
            continue;
        const separator = INLINE_ELEMENTS.has(node.tag) && node.tag !== "br" ? "" : " ";
        out.push(separator);
        collectText(node.children, out);
        out.push(separator);
    }
}
export function plainText(html) {
    const parts = [];
    collectText(parseBody(html), parts);
    return parts.join("").replace(/\s+/g, " ").trim();
}
export function excerpt(html, maxLength = DESCRIPTION_MAX_LENGTH) {
    const text = plainText(html);
    if (text.length <= maxLength)
        return text;
    const budget = maxLength - ELLIPSIS.length;
    const cut = text.slice(0, budget + 1);
    const boundary = cut.lastIndexOf(" ");
    const head = boundary > 0 ? cut.slice(0, boundary) : text.slice(0, budget);
    return head.replace(TRAILING_PUNCTUATION, "") + ELLIPSIS;
}
export function descriptionFor(frontmatter, body) {
    const description = frontmatter.description?.trim();
    return description ? description : excerpt(body);
}
