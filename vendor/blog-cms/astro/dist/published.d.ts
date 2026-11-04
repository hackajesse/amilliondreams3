export interface PublishablePost {
    data: {
        status: string;
        publishDate?: string;
    };
}
export declare function getPublishedPosts<T extends PublishablePost>(posts: readonly T[]): T[];
