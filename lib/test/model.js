import { z } from "zod";
import { instanceOfClass } from "../src/custom.js";
export class Test {
    name;
    constructor(name) {
        this.name = name;
    }
}
export const dataSchema = z.object({
    class: instanceOfClass(Test),
    id: z.string(),
    name: z.string(),
    age: z.number(),
    createdAt: z.date(),
    expiredAt: z.date(),
    arrayDate: z.date().array(),
    arrayNumber: z.number().array(),
    testUnion: z.number().or(z.date()),
    testObj: z.object({
        createdAt: z.date(),
        expiredAt: z.date(),
        arrayDate: z.date().array(),
        arrayNumber: z.number().array(),
        testUnion: z.number().or(z.date()),
    }),
});
export const testData = {
    class: new Test("hello world"),
    id: "1",
    name: "dragon",
    age: 18,
    createdAt: new Date(),
    expiredAt: new Date(),
    arrayDate: [new Date()],
    arrayNumber: [128],
    testUnion: 59,
    testObj: {
        createdAt: new Date(),
        expiredAt: new Date(),
        arrayDate: [new Date()],
        arrayNumber: [1],
        testUnion: 1,
    },
};
//# sourceMappingURL=model.js.map