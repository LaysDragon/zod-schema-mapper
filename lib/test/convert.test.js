// sum.test.js
import { expect, describe, it, expectTypeOf } from "vitest";
import { dataSchema, Test, testData } from "./model.js";
import { z } from "zod";
import { createMapper } from "../src/main.js";
import { ZodInstaceOfClass } from "../src/custom.js";
// import { jsonSchemaMapper } from "../src/converter.js";
export function jsonSchemaMapper(schema) {
    return createMapper(schema, (schema) => schema instanceof z.ZodDate, (schema) => schema.transform((value) => value.toISOString()), (schema) => z
        .string()
        .datetime()
        .transform((value) => new Date(value))
        .pipe(schema))
        .create((schema) => schema instanceof z.ZodNumber, (schema) => schema.transform((value) => value.toString()), (schema) => z
        .string()
        .transform((value) => Number(value))
        .pipe(schema))
        .create((schema) => ZodInstaceOfClass.isSchema(Test, schema), (schema) => schema.transform((value) => value.name), (schema) => z
        .string()
        .transform((value) => new Test(value))
        .pipe(schema))
        .mapper();
}
describe("create converter schema", () => {
    const jsonMapper = jsonSchemaMapper(dataSchema);
    expectTypeOf(jsonMapper.encode).toMatchTypeOf();
    describe("data to json", () => {
        let jsonData = jsonMapper.encode.parse(testData);
        expectTypeOf(jsonData).toEqualTypeOf();
        it("check object field", () => {
            expectTypeOf(jsonData.createdAt).toEqualTypeOf();
            expect(jsonData.createdAt).toEqual(testData.createdAt.toISOString());
        });
        it("check array value", () => {
            expectTypeOf(jsonData.arrayDate[0]).toEqualTypeOf();
            expect(jsonData.arrayDate[0]).toEqual(testData.arrayDate[0].toISOString());
        });
        it("check union value", () => {
            expectTypeOf(jsonData.testUnion).toEqualTypeOf();
            expect(jsonData.testUnion).toEqual(String(testData.testUnion));
        });
        it("check custom class type", () => {
            expectTypeOf(jsonData.class).toEqualTypeOf();
            expect(jsonData.class).toEqual(testData.class.name);
        });
    });
    describe("json to data", () => {
        let jsonData = jsonMapper.encode.parse(testData);
        console.dir(jsonData);
        // type a = z.input<typeof jsonMapper.decode>;
        let data = jsonMapper.decode.parse(jsonData);
        console.dir(data);
        expectTypeOf(data).toEqualTypeOf();
        it("check object field", () => {
            expectTypeOf(data.createdAt).toEqualTypeOf();
            expect(data.createdAt).toEqual(testData.createdAt);
        });
        it("check array value", () => {
            expectTypeOf(data.arrayDate[0]).toEqualTypeOf();
            expect(data.arrayDate[0]).toEqual(testData.arrayDate[0]);
        });
        it("check union value", () => {
            expectTypeOf(data.testUnion).toEqualTypeOf();
            expect(data.testUnion).toEqual(testData.testUnion);
        });
        it("check custom class type", () => {
            expectTypeOf(data.class).toEqualTypeOf();
            expect(data.class.name).toEqual(testData.class.name);
        });
    });
});
//# sourceMappingURL=convert.test.js.map