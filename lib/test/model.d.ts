import { z } from "zod";
export declare class Test {
    name: string | undefined;
    constructor(name: string);
}
export declare const dataSchema: z.ZodObject<{
    class: import("../src/custom.js").ZodInstaceOfClass<typeof Test>;
    id: z.ZodString;
    name: z.ZodString;
    age: z.ZodNumber;
    createdAt: z.ZodDate;
    expiredAt: z.ZodDate;
    arrayDate: z.ZodArray<z.ZodDate, "many">;
    arrayNumber: z.ZodArray<z.ZodNumber, "many">;
    testUnion: z.ZodUnion<[z.ZodNumber, z.ZodDate]>;
    testObj: z.ZodObject<{
        createdAt: z.ZodDate;
        expiredAt: z.ZodDate;
        arrayDate: z.ZodArray<z.ZodDate, "many">;
        arrayNumber: z.ZodArray<z.ZodNumber, "many">;
        testUnion: z.ZodUnion<[z.ZodNumber, z.ZodDate]>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        expiredAt: Date;
        arrayDate: Date[];
        arrayNumber: number[];
        testUnion: number | Date;
    }, {
        createdAt: Date;
        expiredAt: Date;
        arrayDate: Date[];
        arrayNumber: number[];
        testUnion: number | Date;
    }>;
}, "strip", z.ZodTypeAny, {
    class: Test;
    id: string;
    name: string;
    age: number;
    createdAt: Date;
    expiredAt: Date;
    arrayDate: Date[];
    arrayNumber: number[];
    testUnion: number | Date;
    testObj: {
        createdAt: Date;
        expiredAt: Date;
        arrayDate: Date[];
        arrayNumber: number[];
        testUnion: number | Date;
    };
}, {
    class: Test;
    id: string;
    name: string;
    age: number;
    createdAt: Date;
    expiredAt: Date;
    arrayDate: Date[];
    arrayNumber: number[];
    testUnion: number | Date;
    testObj: {
        createdAt: Date;
        expiredAt: Date;
        arrayDate: Date[];
        arrayNumber: number[];
        testUnion: number | Date;
    };
}>;
export type Data = z.infer<typeof dataSchema>;
export declare const testData: Data;
