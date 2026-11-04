import { isAllowedDimension, isAllowedHref, isAllowedImageSrc } from "./allowed.js";
import { element, getAttr, isElement, isInlineNode, isWhitespaceText, parseBody, } from "./model.js";
import { BLOCK_WRAPPERS, cleanHref, HEADING_MAP, isDropped, marksFor } from "./sanitize-rules.js";
import { serializeBody } from "./serialize.js";
const TOP = { inFigure: false, inTextblock: false, inList: false };
const TEXT = { inFigure: false, inTextblock: true, inList: false };
const LIST_ITEMS = { inFigure: false, inTextblock: false, inList: true };
const TEXTBLOCKS = new Set(["p", "h2", "h3"]);
const LISTS = new Set(["ul", "ol"]);
const IMAGE_DIMENSIONS = ["width", "height"];
const isBlock = (node) => !isInlineNode(node);
const hasContent = (nodes) => nodes.some((node) => !isWhitespaceText(node));
function sanitizeAll(nodes, ctx) {
    return nodes.flatMap((node) => sanitizeNode(node, ctx));
}
function wrapInline(tag, attrs, children) {
    if (!hasContent(children) || children.some(isBlock))
        return children;
    return [element(tag, attrs, children)];
}
function groupListItems(children) {
    const items = [];
    let pending = [];
    const flush = () => {
        if (hasContent(pending))
            items.push(element("li", [], pending));
        pending = [];
    };
    for (const child of children) {
        if (isElement(child, "li")) {
            flush();
            items.push(child);
        }
        else
            pending.push(child);
    }
    flush();
    return items;
}
function sanitizeImage(node, ctx) {
    const src = getAttr(node, "src")?.trim();
    if (!ctx.inFigure || !src || !isAllowedImageSrc(src))
        return [];
    const attrs = [["src", src]];
    const alt = getAttr(node, "alt");
    if (alt !== undefined)
        attrs.push(["alt", alt]);
    for (const name of IMAGE_DIMENSIONS) {
        const value = getAttr(node, name)?.trim();
        if (value !== undefined && isAllowedDimension(value))
            attrs.push([name, value]);
    }
    return [element("img", attrs)];
}
function findImage(nodes) {
    for (const node of nodes) {
        if (!isElement(node))
            continue;
        if (node.tag === "img")
            return node;
        const nested = findImage(node.children);
        if (nested)
            return nested;
    }
    return undefined;
}
function sanitizeFigure(node, ctx) {
    const children = sanitizeAll(node.children, { ...TOP, inFigure: true, inTextblock: ctx.inTextblock });
    const image = findImage(children);
    const caption = children.find((child) => isElement(child, "figcaption"));
    if (ctx.inTextblock || !image) {
        return children.map((child) => (isElement(child, "figcaption") ? element("p", [], child.children) : child));
    }
    return [element("figure", [], caption ? [image, caption] : [image])];
}
function sanitizeBlockWrapper(node, ctx) {
    const children = sanitizeAll(node.children, { ...TOP, inTextblock: ctx.inTextblock });
    if (ctx.inTextblock || children.some(isBlock))
        return children;
    return hasContent(children) ? [element("p", [], children)] : [];
}
function sanitizeStructure(node, tag, ctx) {
    if (TEXTBLOCKS.has(tag)) {
        return ctx.inTextblock ? sanitizeAll(node.children, ctx) : [element(tag, [], sanitizeAll(node.children, TEXT))];
    }
    if (LISTS.has(tag)) {
        if (ctx.inTextblock)
            return sanitizeAll(node.children, ctx);
        return [element(tag, [], groupListItems(sanitizeAll(node.children, LIST_ITEMS)))];
    }
    if (tag === "li") {
        return ctx.inList ? [element("li", [], sanitizeAll(node.children, TOP))] : sanitizeBlockWrapper(node, ctx);
    }
    if (tag === "blockquote") {
        return ctx.inTextblock ? sanitizeAll(node.children, ctx) : [element(tag, [], sanitizeAll(node.children, TOP))];
    }
    return null;
}
function sanitizeElement(node, ctx) {
    if (isDropped(node))
        return [];
    const tag = HEADING_MAP[node.tag] ?? node.tag;
    const structure = sanitizeStructure(node, tag, ctx);
    if (structure)
        return structure;
    const marks = marksFor(node);
    if (marks) {
        const children = sanitizeAll(node.children, ctx);
        return marks.reduceRight((inner, mark) => wrapInline(mark, [], inner), children);
    }
    switch (tag) {
        case "a": {
            const href = cleanHref(getAttr(node, "href"));
            const children = sanitizeAll(node.children, ctx);
            return href && isAllowedHref(href) ? wrapInline("a", [["href", href]], children) : children;
        }
        case "br":
            return [element("br")];
        case "hr":
            return ctx.inTextblock ? [] : [element("hr")];
        case "img":
            return sanitizeImage(node, ctx);
        case "figure":
            return sanitizeFigure(node, ctx);
        case "figcaption": {
            const children = sanitizeAll(node.children, TEXT);
            if (ctx.inTextblock)
                return children;
            return [element(ctx.inFigure ? "figcaption" : "p", [], children)];
        }
    }
    if (BLOCK_WRAPPERS.has(tag))
        return sanitizeBlockWrapper(node, ctx);
    return sanitizeAll(node.children, ctx);
}
function sanitizeNode(node, ctx) {
    return node.kind === "element" ? sanitizeElement(node, ctx) : [node];
}
export function sanitizeBody(html) {
    return serializeBody(sanitizeAll(parseBody(html), TOP));
}
