export declare function postPath(permalink: string, slug: string, publishDate: string | undefined, timeZone: string): string;
export declare function absoluteUrl(siteUrl: string, path: string): string;
export declare function applyTitleTemplate(template: string, title: string): string;
export declare function modifiedDate(post: {
    updatedDate?: string;
    publishDate?: string;
}): string;
