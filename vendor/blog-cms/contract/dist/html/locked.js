import { LockedBlockError } from "../errors.js";
import { LOCKED_BLOCK_CLOSE_TAG, LOCKED_BLOCK_OPEN_TAG } from "./allowed.js";
import { element, getAttr, isElement, lockedNode, parseBody } from "./model.js";
import { serializeBody } from "./serialize.js";
export const LOCKED_PLACEHOLDER_ATTRIBUTE = "data-locked-block";
const PLACEHOLDER_TAG = "div";
const INDEX = /^\d+$/;
function isLocked(node) {
    return node.kind === "locked";
}
export function lockedBlockPlaceholder(index) {
    return `<${PLACEHOLDER_TAG} ${LOCKED_PLACEHOLDER_ATTRIBUTE}="${index}"></${PLACEHOLDER_TAG}>`;
}
export function extractLockedBlocks(body) {
    return parseBody(body)
        .filter(isLocked)
        .map((node) => node.source);
}
export function extractLockedInnerHtml(body) {
    return parseBody(body)
        .filter(isLocked)
        .map((node) => node.innerHtml);
}
function lockedFromStored(source) {
    const open = LOCKED_BLOCK_OPEN_TAG.length;
    const close = LOCKED_BLOCK_CLOSE_TAG.length;
    if (!source.startsWith(LOCKED_BLOCK_OPEN_TAG) || !source.endsWith(LOCKED_BLOCK_CLOSE_TAG)) {
        throw new LockedBlockError("Locked block is not in canonical form.");
    }
    return lockedNode(source.slice(open, -close));
}
export function lockedBlockPlaceholders(body) {
    const blocks = [];
    const nodes = parseBody(body).map((node) => {
        if (!isLocked(node))
            return node;
        blocks.push(node.source);
        return element(PLACEHOLDER_TAG, [[LOCKED_PLACEHOLDER_ATTRIBUTE, String(blocks.length - 1)]]);
    });
    return { body: serializeBody(nodes), blocks };
}
export function restoreLockedBlocks(body, blocks) {
    const nodes = parseBody(body).map((node) => {
        const index = isElement(node, PLACEHOLDER_TAG) ? getAttr(node, LOCKED_PLACEHOLDER_ATTRIBUTE) : undefined;
        if (index === undefined)
            return node;
        const source = INDEX.test(index) ? blocks[Number(index)] : undefined;
        if (source === undefined)
            throw new LockedBlockError(`No locked block for placeholder ${index}.`);
        return lockedFromStored(source);
    });
    return serializeBody(nodes);
}
export function findNewLockedBlocks(body, storedBody) {
    const stored = new Set(extractLockedBlocks(storedBody));
    return extractLockedBlocks(body).filter((block) => !stored.has(block));
}
