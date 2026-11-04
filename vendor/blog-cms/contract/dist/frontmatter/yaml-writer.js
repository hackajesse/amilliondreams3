import { formatUtcDate } from "./dates.js";
import { FIELD_KINDS, FRONTMATTER_FIELDS, REQUIRED_FIELDS } from "./types.js";
const LIST_ITEM_INDENT = "  ";
const NAMED_ESCAPES = {
    "\\": "\\\\",
    '"': '\\"',
    "\t": "\\t",
    "\n": "\\n",
    "\r": "\\r",
};
const NEEDS_ESCAPE = /[\\"\u0000-\u001f\u007f-\u009f\u00a0\u2028\u2029\ufeff]/g;
function escapeChar(char) {
    const named = NAMED_ESCAPES[char];
    if (named)
        return named;
    const code = char.charCodeAt(0);
    return code < 0x100
        ? `\\x${code.toString(16).toUpperCase().padStart(2, "0")}`
        : `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`;
}
export function quoteYamlString(value) {
    return `"${value.replace(NEEDS_ESCAPE, escapeChar)}"`;
}
function isEmpty(value) {
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}
function writeValue(key, value) {
    const kind = FIELD_KINDS[key];
    switch (kind) {
        case "status":
            return `${key}: ${String(value)}\n`;
        case "boolean":
        case "integer":
            return `${key}: ${String(value)}\n`;
        case "date":
            return `${key}: ${quoteYamlString(formatUtcDate(String(value)) ?? String(value))}\n`;
        case "list":
            return `${key}:\n${value.map((item) => `${LIST_ITEM_INDENT}- ${quoteYamlString(item)}\n`).join("")}`;
        case "string":
            return `${key}: ${quoteYamlString(String(value))}\n`;
    }
}
export function writeFrontmatter(frontmatter, unknownFields = []) {
    let yaml = "";
    for (const key of FRONTMATTER_FIELDS) {
        const value = frontmatter[key];
        if (!REQUIRED_FIELDS.includes(key) && isEmpty(value))
            continue;
        yaml += writeValue(key, value ?? "");
    }
    return yaml + unknownFields.join("");
}
