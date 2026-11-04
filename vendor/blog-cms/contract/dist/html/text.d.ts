export declare const DESCRIPTION_MAX_LENGTH = 155;
export declare function plainText(html: string): string;
export declare function excerpt(html: string, maxLength?: number): string;
export declare function descriptionFor(frontmatter: {
    description?: string;
}, body: string): string;
