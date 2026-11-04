export const FALLBACK_SLUG = "untitled";
const LETTER_REPLACEMENTS = {
    ß: "ss",
    æ: "ae",
    œ: "oe",
    ø: "o",
    đ: "d",
    ð: "d",
    þ: "th",
    ł: "l",
    ı: "i",
};
const SPECIAL_LETTERS = new RegExp(`[${Object.keys(LETTER_REPLACEMENTS).join("")}]`, "g");
const COMBINING_MARKS = /\p{M}+/gu;
const APOSTROPHES = /['\u2018\u2019\u02bc]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FIRST_SUFFIX = 2;
export function slugify(title) {
    const slug = title
        .normalize("NFKD")
        .replace(COMBINING_MARKS, "")
        .toLowerCase()
        .replace(SPECIAL_LETTERS, (letter) => LETTER_REPLACEMENTS[letter] ?? "")
        .replace(APOSTROPHES, "")
        .replace(NON_ALPHANUMERIC, "-")
        .replace(EDGE_HYPHENS, "");
    return slug || FALLBACK_SLUG;
}
export function uniqueSlug(base, existing) {
    const taken = new Set(existing);
    if (!taken.has(base))
        return base;
    let suffix = FIRST_SUFFIX;
    while (taken.has(`${base}-${suffix}`))
        suffix += 1;
    return `${base}-${suffix}`;
}
export function isValidSlug(slug) {
    return VALID_SLUG.test(slug);
}
