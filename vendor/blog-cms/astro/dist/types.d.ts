export interface SiteSettings {
    name: string;
    url: string;
    authorName: string;
    authorUrl: string;
    sameAs: readonly string[];
    defaultImage: string;
    titleTemplate: string;
    /** IANA time zone. Date permalink tokens use publishDate in this zone. */
    timezone: string;
    permalink: string;
    feedPath: string;
    postsDirectory: string;
    sitemapPath: string;
    indexNowKey: string;
    pageSize: number;
}
export interface HeadPostData {
    title: string;
    seoTitle?: string;
    description?: string;
    publishDate?: string;
    updatedDate?: string;
    tags?: readonly string[];
    image?: string;
    imageAlt?: string;
    noindex?: boolean;
    canonical?: string;
}
export interface HeadPost {
    id: string;
    body?: string;
    data: HeadPostData;
}
