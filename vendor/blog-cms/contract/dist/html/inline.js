import { escapeText } from "./escape.js";
import { closeTag, isVoid, openTag } from "./markup.js";
import { isInlineNode } from "./model.js";
import { RAW_TEXT_ELEMENTS } from "./tags.js";
const COLLAPSIBLE_WHITESPACE = /[ \t\n\r\f]+/g;
const LINE_BREAK = "br";
function collect(nodes, pieces, opaque) {
    for (const node of nodes) {
        if (node.kind === "text")
            pieces.push({ kind: "text", value: node.value });
        else if (node.kind === "locked")
            pieces.push({ kind: "atom", html: node.source });
        else if (node.tag === LINE_BREAK)
            pieces.push({ kind: "break", html: openTag(node) });
        else if (isVoid(node))
            pieces.push({ kind: "atom", html: openTag(node) });
        else if (!isInlineNode(node) || RAW_TEXT_ELEMENTS.has(node.tag)) {
            pieces.push({ kind: "atom", html: opaque(node) });
        }
        else {
            pieces.push({ kind: "tag", html: openTag(node) });
            collect(node.children, pieces, opaque);
            pieces.push({ kind: "tag", html: closeTag(node) });
        }
    }
}
function collapseWhitespace(pieces) {
    let dropLeadingSpace = true;
    for (const piece of pieces) {
        if (piece.kind === "break")
            dropLeadingSpace = true;
        else if (piece.kind === "atom")
            dropLeadingSpace = false;
        else if (piece.kind === "text") {
            let value = piece.value.replace(COLLAPSIBLE_WHITESPACE, " ");
            if (dropLeadingSpace && value.startsWith(" "))
                value = value.slice(1);
            piece.value = value;
            if (value !== "")
                dropLeadingSpace = value.endsWith(" ");
        }
    }
}
function trimTrailingSpace(pieces) {
    for (let index = pieces.length - 1; index >= 0; index -= 1) {
        const piece = pieces[index];
        if (piece.kind === "tag")
            continue;
        if (piece.kind === "text") {
            if (piece.value === "")
                continue;
            piece.value = piece.value.replace(/ $/, "");
        }
        return;
    }
}
export function serializeInlineRun(nodes, opaque) {
    const pieces = [];
    collect(nodes, pieces, opaque);
    collapseWhitespace(pieces);
    trimTrailingSpace(pieces);
    return pieces.map((piece) => (piece.kind === "text" ? escapeText(piece.value) : piece.html)).join("");
}
