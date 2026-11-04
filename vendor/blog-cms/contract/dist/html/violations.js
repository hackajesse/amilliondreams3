import { allowedAttributes, isAllowedDimension, isAllowedElement, isAllowedHref, isAllowedImageSrc, LOCKED_BLOCK_ATTRIBUTE, } from "./allowed.js";
import { getAttr, isElement, isWhitespaceText, parseBody } from "./model.js";
import { serializeBody } from "./serialize.js";
const IMAGE_DIMENSIONS = ["width", "height"];
const LISTS = new Set(["ul", "ol"]);
const REQUIRED_PARENTS = {
    li: { tags: ["ul", "ol"], label: "<ul> or <ol>" },
    figcaption: { tags: ["figure"], label: "<figure>" },
};
function elementViolations(node, parentTag) {
    if (node.tag === "div" && getAttr(node, LOCKED_BLOCK_ATTRIBUTE) !== undefined) {
        return [{ code: "locked", message: "Locked blocks must be at the top level." }];
    }
    if (!isAllowedElement(node.tag))
        return [{ code: "element", message: `Element <${node.tag}> is not allowed.` }];
    const allowed = allowedAttributes(node.tag);
    const violations = node.attrs
        .filter(([name]) => !allowed.includes(name))
        .map(([name]) => ({ code: "attribute", message: `Attribute "${name}" is not allowed on <${node.tag}>.` }));
    if (node.tag === "a") {
        const href = getAttr(node, "href") ?? "";
        if (!isAllowedHref(href)) {
            violations.push({ code: "link", message: `Link "${href}" must be http, https, mailto, or site-relative.` });
        }
    }
    if (node.tag === "img")
        violations.push(...imageViolations(node, parentTag));
    violations.push(...structureViolations(node, parentTag));
    return violations;
}
function structureViolations(node, parentTag) {
    const violations = [];
    const required = REQUIRED_PARENTS[node.tag];
    if (required && !required.tags.includes(parentTag ?? "")) {
        violations.push({ code: "structure", message: `Element <${node.tag}> must be inside ${required.label}.` });
    }
    if (LISTS.has(node.tag)) {
        for (const child of node.children) {
            if ((child.kind === "element" && child.tag === "li") || isWhitespaceText(child))
                continue;
            const what = child.kind === "element" ? `Element <${child.tag}>` : "Text";
            violations.push({ code: "structure", message: `${what} cannot be inside <${node.tag}>.` });
        }
    }
    if (node.tag === "figure" && !isFigureShape(node)) {
        violations.push({ code: "structure", message: "A figure must hold one image and an optional caption." });
    }
    return violations;
}
function isFigureShape(node) {
    const [first, second, ...rest] = node.children;
    const captionOk = second === undefined || isElement(second, "figcaption");
    return first !== undefined && isElement(first, "img") && captionOk && rest.length === 0;
}
function imageViolations(node, parentTag) {
    const violations = [];
    const src = getAttr(node, "src") ?? "";
    if (!isAllowedImageSrc(src)) {
        violations.push({ code: "image", message: `Image source "${src}" must be https or site-relative.` });
    }
    if (parentTag !== "figure")
        violations.push({ code: "image", message: "Images must be inside a figure." });
    for (const name of IMAGE_DIMENSIONS) {
        const value = getAttr(node, name);
        if (value !== undefined && !isAllowedDimension(value)) {
            violations.push({ code: "image", message: `Image ${name} must be a whole number of pixels.` });
        }
    }
    return violations;
}
function walk(nodes, parentTag, out) {
    for (const node of nodes) {
        if (node.kind !== "element")
            continue;
        out.push(...elementViolations(node, parentTag));
        walk(node.children, node.tag, out);
    }
}
export function findBodyViolations(html) {
    const nodes = parseBody(html);
    const violations = [];
    walk(nodes, null, violations);
    if (violations.length === 0 && serializeBody(nodes) !== html) {
        violations.push({ code: "format", message: "Body is not in canonical form." });
    }
    return violations;
}
export function isCleanBody(html) {
    return findBodyViolations(html).length === 0;
}
