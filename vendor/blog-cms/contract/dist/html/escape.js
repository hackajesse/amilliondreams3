const TEXT_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\u00a0": "&nbsp;" };
const ATTRIBUTE_ESCAPES = { "&": "&amp;", '"': "&quot;", "\u00a0": "&nbsp;" };
export function escapeText(value) {
    return value.replace(/[&<>\u00a0]/g, (char) => TEXT_ESCAPES[char] ?? char);
}
export function escapeAttribute(value) {
    return value.replace(/[&"\u00a0]/g, (char) => ATTRIBUTE_ESCAPES[char] ?? char);
}
