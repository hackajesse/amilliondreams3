const DATE_TOKEN = /\{(?:yyyy|mm|dd)\}/;
/** Year, month, and day of an instant in a time zone. Month and day are zero-padded. */
export function calendarDate(iso, timeZone) {
    if (iso.trim() === "")
        return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime()))
        return null;
    let parts;
    try {
        parts = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(date);
    }
    catch {
        return null;
    }
    const pick = (type) => parts.find((part) => part.type === type)?.value ?? "";
    const yyyy = pick("year");
    const mm = pick("month");
    const dd = pick("day");
    if (!/^\d{4}$/.test(yyyy) || !/^\d{2}$/.test(mm) || !/^\d{2}$/.test(dd))
        return null;
    return { yyyy, mm, dd };
}
/**
 * Fills `{slug}`, `{yyyy}`, `{mm}`, and `{dd}`. Date tokens use `publishDate` in `timeZone`.
 * A pattern with no date tokens ignores the date. A dated pattern without a usable date throws.
 */
export function expandPermalink(permalink, slug, publishDate, timeZone) {
    let raw = permalink;
    if (DATE_TOKEN.test(permalink)) {
        const parts = publishDate ? calendarDate(publishDate, timeZone) : null;
        if (!parts)
            throw new Error("A dated permalink needs a publishDate in the site time zone.");
        raw = raw.replaceAll("{yyyy}", parts.yyyy).replaceAll("{mm}", parts.mm).replaceAll("{dd}", parts.dd);
    }
    raw = raw.replaceAll("{slug}", slug);
    const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}
