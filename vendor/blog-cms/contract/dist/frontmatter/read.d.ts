import { type Frontmatter } from "./types.ts";
export interface ReadFrontmatterResult {
    frontmatter: Frontmatter;
    unknownFields: string[];
}
export declare function readFrontmatter(yamlText: string): ReadFrontmatterResult;
