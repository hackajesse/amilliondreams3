export type BodyViolationCode = "element" | "attribute" | "link" | "image" | "locked" | "structure" | "format";
export interface BodyViolation {
    code: BodyViolationCode;
    message: string;
}
export declare function findBodyViolations(html: string): BodyViolation[];
export declare function isCleanBody(html: string): boolean;
