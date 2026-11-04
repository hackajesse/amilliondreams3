import { isCanonicalUtcDate } from "./dates.js";
import { fieldTypeErrors, isRecord } from "./field-types.js";
const DATE_FIELDS = ["publishDate", "updatedDate"];
const DATE_EXAMPLE = "2026-11-06T20:00:00Z";
const ABSOLUTE_HTTP_URL = /^https?:\/\/[^\s/?#]+/i;
const SITE_RELATIVE_PATH = /^\/(?!\/)/;
function hasText(value) {
    return value !== undefined && value.trim() !== "";
}
function ruleErrors(fm) {
    const errors = [];
    if (!hasText(fm.title))
        errors.push({ field: "title", message: "Title is required." });
    if (fm.status !== "draft" && !hasText(fm.publishDate)) {
        errors.push({ field: "publishDate", message: `A ${fm.status} post needs a publish date.` });
    }
    for (const field of DATE_FIELDS) {
        const value = fm[field];
        if (hasText(value) && !isCanonicalUtcDate(value)) {
            errors.push({ field, message: `${field} must be a UTC date like ${DATE_EXAMPLE}.` });
        }
    }
    if (hasText(fm.image) && !SITE_RELATIVE_PATH.test(fm.image)) {
        errors.push({ field: "image", message: "image must be a site-relative path starting with /." });
    }
    if (hasText(fm.image) && !hasText(fm.imageAlt)) {
        errors.push({ field: "imageAlt", message: "imageAlt is required when image is set." });
    }
    if (hasText(fm.canonical) && !ABSOLUTE_HTTP_URL.test(fm.canonical)) {
        errors.push({ field: "canonical", message: "canonical must be an absolute http or https URL." });
    }
    return errors;
}
export function validateFrontmatter(input) {
    if (!isRecord(input))
        return [{ field: "frontmatter", message: "Frontmatter must be an object." }];
    const typeErrors = fieldTypeErrors(input);
    if (typeErrors.length > 0)
        return typeErrors;
    return ruleErrors(input);
}
