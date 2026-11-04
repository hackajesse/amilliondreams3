export const POST_STATUSES = ["draft", "scheduled", "published"];
export const FRONTMATTER_FIELDS = [
    "title",
    "status",
    "publishDate",
    "updatedDate",
    "description",
    "seoTitle",
    "tags",
    "categories",
    "image",
    "imageAlt",
    "noindex",
    "canonical",
    "wpId",
];
export const FIELD_KINDS = {
    title: "string",
    status: "status",
    publishDate: "date",
    updatedDate: "date",
    description: "string",
    seoTitle: "string",
    tags: "list",
    categories: "list",
    image: "string",
    imageAlt: "string",
    noindex: "boolean",
    canonical: "string",
    wpId: "integer",
};
export const REQUIRED_FIELDS = ["title", "status"];
export function isFrontmatterField(key) {
    return FRONTMATTER_FIELDS.includes(key);
}
export function isPostStatus(value) {
    return typeof value === "string" && POST_STATUSES.includes(value);
}
