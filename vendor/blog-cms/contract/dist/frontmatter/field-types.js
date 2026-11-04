import { FIELD_KINDS, FRONTMATTER_FIELDS, isPostStatus } from "./types.js";
const TYPE_MESSAGES = {
    string: "must be text",
    status: "must be draft, scheduled, or published",
    date: "must be a date string",
    list: "must be a list of text items",
    boolean: "must be true or false",
    integer: "must be a whole number",
};
const REQUIRED_MESSAGES = {
    title: "Title is required.",
    status: "Status must be draft, scheduled, or published.",
};
function hasKind(value, kind) {
    switch (kind) {
        case "string":
        case "date":
            return typeof value === "string";
        case "status":
            return isPostStatus(value);
        case "list":
            return Array.isArray(value) && value.every((item) => typeof item === "string");
        case "boolean":
            return typeof value === "boolean";
        case "integer":
            return Number.isSafeInteger(value);
    }
}
export function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function fieldTypeErrors(input) {
    const errors = [];
    for (const field of FRONTMATTER_FIELDS) {
        const value = input[field];
        const missing = value === undefined || value === null;
        const requiredMessage = REQUIRED_MESSAGES[field];
        if (missing) {
            if (requiredMessage)
                errors.push({ field, message: requiredMessage });
            continue;
        }
        const kind = FIELD_KINDS[field];
        if (hasKind(value, kind))
            continue;
        errors.push({ field, message: requiredMessage && kind === "status" ? requiredMessage : `${field} ${TYPE_MESSAGES[kind]}.` });
    }
    return errors;
}
