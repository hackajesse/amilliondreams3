import { expandPermalink } from "@blog-cms/contract";
export function postPath(permalink, slug, publishDate, timeZone) {
    return expandPermalink(permalink, slug, publishDate, timeZone);
}
export function absoluteUrl(siteUrl, path) {
    const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
    return new URL(path, base).href;
}
export function applyTitleTemplate(template, title) {
    return template.replaceAll("{title}", title);
}
export function modifiedDate(post) {
    return post.updatedDate ?? post.publishDate ?? "";
}
