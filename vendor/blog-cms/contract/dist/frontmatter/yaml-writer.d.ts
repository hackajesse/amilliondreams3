import { type Frontmatter } from "./types.ts";
export declare function quoteYamlString(value: string): string;
export declare function writeFrontmatter(frontmatter: Frontmatter, unknownFields?: readonly string[]): string;
