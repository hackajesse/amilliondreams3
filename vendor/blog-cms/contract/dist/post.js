import { PostFormatError } from "./errors.js";
import { readFrontmatter } from "./frontmatter/read.js";
import { writeFrontmatter } from "./frontmatter/yaml-writer.js";
export const FRONTMATTER_DELIMITER = "---";
const OPENING = `${FRONTMATTER_DELIMITER}\n`;
const CLOSING_LINE = `\n${FRONTMATTER_DELIMITER}\n`;
function findClosing(text) {
    const afterOpening = OPENING.length;
    if (text.startsWith(OPENING, afterOpening) || text.slice(afterOpening) === FRONTMATTER_DELIMITER) {
        return { yamlEnd: afterOpening, bodyStart: Math.min(text.length, afterOpening + OPENING.length) };
    }
    const index = text.indexOf(CLOSING_LINE, afterOpening - 1);
    if (index !== -1)
        return { yamlEnd: index + 1, bodyStart: index + CLOSING_LINE.length };
    if (text.endsWith(`\n${FRONTMATTER_DELIMITER}`)) {
        return { yamlEnd: text.length - FRONTMATTER_DELIMITER.length, bodyStart: text.length };
    }
    throw new PostFormatError("Frontmatter has no closing --- line.");
}
export function parsePost(text) {
    if (!text.startsWith(OPENING))
        throw new PostFormatError("A post file must start with a --- line.");
    const { yamlEnd, bodyStart } = findClosing(text);
    const { frontmatter, unknownFields } = readFrontmatter(text.slice(OPENING.length, yamlEnd));
    const rest = text.slice(bodyStart);
    const body = rest.endsWith("\n") ? rest.slice(0, -1) : rest;
    return { frontmatter, unknownFields, body };
}
export function serializePost(post) {
    const yaml = writeFrontmatter(post.frontmatter, post.unknownFields);
    const body = post.body === "" ? "" : `${post.body}\n`;
    return `${OPENING}${yaml}${OPENING}${body}`;
}
