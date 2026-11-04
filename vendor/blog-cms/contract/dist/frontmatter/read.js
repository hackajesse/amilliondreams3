import { isMap, isScalar, parseDocument } from "yaml";
import { PostFormatError } from "../errors.js";
import { fieldTypeErrors, isRecord } from "./field-types.js";
import { FRONTMATTER_FIELDS, isFrontmatterField } from "./types.js";
function lineStart(text, offset) {
    return text.lastIndexOf("\n", offset - 1) + 1;
}
function withLeadingComments(text, start, floor) {
    let current = start;
    while (current > floor) {
        const previous = lineStart(text, current - 1);
        if (!text.startsWith("#", previous))
            break;
        current = previous;
    }
    return current;
}
function topLevelEntries(yamlText) {
    const doc = parseDocument(yamlText);
    const firstError = doc.errors[0];
    if (firstError)
        throw new PostFormatError(`Frontmatter is not valid YAML: ${firstError.message}`);
    if (doc.contents === null)
        return { entries: [], values: {} };
    if (!isMap(doc.contents))
        throw new PostFormatError("Frontmatter must be a list of key: value fields.");
    const entries = [];
    for (const pair of doc.contents.items) {
        const keyNode = pair.key;
        const range = isScalar(keyNode) ? keyNode.range : null;
        if (!isScalar(keyNode) || !range || lineStart(yamlText, range[0]) !== range[0]) {
            throw new PostFormatError("Frontmatter keys must start at the beginning of a line.");
        }
        entries.push({ key: String(keyNode.value), start: range[0] });
    }
    const values = doc.toJS();
    return { entries, values: isRecord(values) ? values : {} };
}
function unknownRawFields(yamlText, entries) {
    const starts = entries.map((entry, index) => index === 0 ? 0 : withLeadingComments(yamlText, entry.start, entries[index - 1].start + 1));
    return entries.flatMap((entry, index) => {
        if (isFrontmatterField(entry.key))
            return [];
        return [yamlText.slice(starts[index], starts[index + 1] ?? yamlText.length)];
    });
}
function pickKnown(values) {
    const errors = fieldTypeErrors(values);
    if (errors.length > 0) {
        throw new PostFormatError(errors.map((error) => `${error.field}: ${error.message}`).join(" "));
    }
    const frontmatter = {};
    for (const field of FRONTMATTER_FIELDS) {
        const value = values[field];
        if (value !== undefined && value !== null)
            frontmatter[field] = value;
    }
    return frontmatter;
}
export function readFrontmatter(yamlText) {
    const { entries, values } = topLevelEntries(yamlText);
    return { frontmatter: pickKnown(values), unknownFields: unknownRawFields(yamlText, entries) };
}
