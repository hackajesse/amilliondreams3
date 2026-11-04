const CANONICAL_UTC_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const ISO_8601_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;
const MILLISECONDS = /\.\d{3}Z$/;
export function isCanonicalUtcDate(value) {
    return CANONICAL_UTC_DATE.test(value) && formatUtcDate(value) === value;
}
export function formatUtcDate(value) {
    if (typeof value === "string" && !ISO_8601_DATE.test(value))
        return null;
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime()))
        return null;
    return date.toISOString().replace(MILLISECONDS, "Z");
}
