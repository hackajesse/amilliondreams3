import { type FieldError } from "./types.ts";
export declare function isRecord(value: unknown): value is Record<string, unknown>;
export declare function fieldTypeErrors(input: Record<string, unknown>): FieldError[];
