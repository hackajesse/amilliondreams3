export declare const POST_STATUSES: readonly ["draft", "scheduled", "published"];
export type PostStatus = (typeof POST_STATUSES)[number];
export interface Frontmatter {
    title: string;
    status: PostStatus;
    publishDate?: string;
    updatedDate?: string;
    description?: string;
    seoTitle?: string;
    tags?: string[];
    categories?: string[];
    image?: string;
    imageAlt?: string;
    noindex?: boolean;
    canonical?: string;
    wpId?: number;
}
export type FrontmatterField = keyof Frontmatter;
export declare const FRONTMATTER_FIELDS: readonly ["title", "status", "publishDate", "updatedDate", "description", "seoTitle", "tags", "categories", "image", "imageAlt", "noindex", "canonical", "wpId"];
export type FieldKind = "string" | "status" | "date" | "list" | "boolean" | "integer";
export declare const FIELD_KINDS: Record<FrontmatterField, FieldKind>;
export declare const REQUIRED_FIELDS: readonly FrontmatterField[];
export declare function isFrontmatterField(key: string): key is FrontmatterField;
export declare function isPostStatus(value: unknown): value is PostStatus;
export interface FieldError {
    field: string;
    message: string;
}
export interface Post {
    frontmatter: Frontmatter;
    unknownFields: string[];
    body: string;
}
