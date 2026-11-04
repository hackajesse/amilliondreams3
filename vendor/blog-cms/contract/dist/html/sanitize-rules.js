import { getAttr } from "./model.js";
export const DROPPED_WITH_CONTENT = new Set([
    "applet", "audio", "button", "canvas", "datalist", "dialog", "embed", "form", "frame",
    "frameset", "head", "iframe", "input", "link", "map", "math", "meta", "noembed",
    "noframes", "noscript", "object", "optgroup", "option", "output", "picture", "progress",
    "script", "select", "slot", "source", "style", "svg", "template", "textarea", "title",
    "track", "video", "xml",
]);
export const BLOCK_WRAPPERS = new Set([
    "address", "article", "aside", "caption", "center", "dd", "details", "div", "dl", "dt",
    "footer", "header", "main", "nav", "pre", "section", "summary", "table", "tbody", "td",
    "tfoot", "th", "thead", "tr",
]);
export const HEADING_MAP = { h1: "h2", h4: "h3", h5: "h3", h6: "h3" };
export const STRONG = "strong";
export const EM = "em";
const BOLD_STYLE = /(?:^|;)\s*font-weight\s*:\s*(?:bold|bolder|[6-9]00)\s*(?:;|$)/i;
const NOT_BOLD_STYLE = /(?:^|;)\s*font-weight\s*:\s*(?:normal|lighter|[1-4]00)\s*(?:;|$)/i;
const ITALIC_STYLE = /(?:^|;)\s*font-style\s*:\s*italic\s*(?:;|$)/i;
const NOT_ITALIC_STYLE = /(?:^|;)\s*font-style\s*:\s*normal\s*(?:;|$)/i;
const WORD_LIST_MARKER = /(?:^|;)\s*mso-list\s*:\s*ignore/i;
const NAMESPACED_TAG = ":";
export function isDropped(node) {
    if (DROPPED_WITH_CONTENT.has(node.tag) || node.tag.includes(NAMESPACED_TAG))
        return true;
    return node.tag === "span" && WORD_LIST_MARKER.test(getAttr(node, "style") ?? "");
}
export function marksFor(node) {
    const style = getAttr(node, "style") ?? "";
    switch (node.tag) {
        case "strong":
        case "em":
            return [node.tag];
        case "b":
            return NOT_BOLD_STYLE.test(style) ? [] : [STRONG];
        case "i":
            return NOT_ITALIC_STYLE.test(style) ? [] : [EM];
        case "span":
            return [...(BOLD_STYLE.test(style) ? [STRONG] : []), ...(ITALIC_STYLE.test(style) ? [EM] : [])];
        default:
            return null;
    }
}
export function cleanHref(href) {
    return href?.trim();
}
