export interface CalendarDate {
    yyyy: string;
    mm: string;
    dd: string;
}
/** Year, month, and day of an instant in a time zone. Month and day are zero-padded. */
export declare function calendarDate(iso: string, timeZone: string): CalendarDate | null;
/**
 * Fills `{slug}`, `{yyyy}`, `{mm}`, and `{dd}`. Date tokens use `publishDate` in `timeZone`.
 * A pattern with no date tokens ignores the date. A dated pattern without a usable date throws.
 */
export declare function expandPermalink(permalink: string, slug: string, publishDate: string | undefined, timeZone: string): string;
