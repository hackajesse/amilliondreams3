import { allowedAttributes } from "./allowed.js";
import { escapeAttribute } from "./escape.js";
import { VOID_ELEMENTS } from "./tags.js";
function orderedAttributes(tag, attrs) {
    const order = allowedAttributes(tag);
    const rank = (name) => {
        const index = order.indexOf(name);
        return index === -1 ? order.length : index;
    };
    return [...attrs].sort((a, b) => rank(a[0]) - rank(b[0]));
}
export function openTag(node) {
    const attrs = orderedAttributes(node.tag, node.attrs)
        .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
        .join("");
    return `<${node.tag}${attrs}>`;
}
export function closeTag(node) {
    return VOID_ELEMENTS.has(node.tag) ? "" : `</${node.tag}>`;
}
export function isVoid(node) {
    return VOID_ELEMENTS.has(node.tag);
}
