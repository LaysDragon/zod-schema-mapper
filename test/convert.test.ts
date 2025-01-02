// sum.test.js
import { expect, test, describe, it, expectTypeOf } from "vitest";
import { Data, dataSchema, Test, testData } from "./model.js";
import { z } from "zod";
import exp from "constants";
import { createMapper, ZodInstaceOfClass } from "../src/main.js";

export function jsonSchemaMapper<ZType extends z.ZodTypeAny>(schema: ZType) {
  return createMapper(
    schema,
    (schema) => schema instanceof z.ZodDate,
    (schema) => schema.transform((value) => value.toISOString()),
    (schema) =>
      z
        .string()
        .datetime()
        .transform((value) => new Date(value))
        .pipe(schema)
  )
    .create(
      (schema) => schema instanceof z.ZodNumber,
      (schema) => schema.transform((value) => value.toString()),
      (schema) =>
        z
          .string()
          .transform((value) => Number(value))
          .pipe(schema)
    )
    .create(
      (schema) => ZodInstaceOfClass.isSchema(Test, schema),
      (schema) => schema.transform((value) => value.name),
      (schema) =>
        z
          .string()
          .transform((value) => new Test(value))
          .pipe(schema)
    )
    .mapper();
}

describe("create converter schema", () => {
  const jsonMapper = jsonSchemaMapper(dataSchema);
  type DataJson = z.infer<typeof jsonMapper.encode>;

  expectTypeOf(jsonMapper.encode).toMatchTypeOf<z.ZodTypeAny>();

  describe("data to json", () => {
    let jsonData = jsonMapper.encode.parse(testData);

    expectTypeOf(jsonData).toEqualTypeOf<DataJson>();

    it("check object field", () => {
      expectTypeOf(jsonData.createdAt).toEqualTypeOf<string>();
      expect(jsonData.createdAt).toEqual(testData.createdAt.toISOString());
    });

    it("check array value", () => {
      expectTypeOf(jsonData.arrayDate[0]).toEqualTypeOf<string>();
      expect(jsonData.arrayDate[0]).toEqual(
        testData.arrayDate[0].toISOString()
      );
    });

    it("check union value", () => {
      expectTypeOf(jsonData.testUnion).toEqualTypeOf<string>();
      expect(jsonData.testUnion).toEqual(String(testData.testUnion));
    });

    it("check custom class type", () => {
      expectTypeOf(jsonData.class).toEqualTypeOf<string | undefined>();
      expect(jsonData.class).toEqual(testData.class.name);
    });
  });

  describe("json to data", () => {
    let jsonData = jsonMapper.encode.parse(testData);
    console.dir(jsonData);
    // type a = z.input<typeof jsonMapper.decode>;
    let data = jsonMapper.decode.parse(jsonData);
    console.dir(data);

    expectTypeOf(data).toEqualTypeOf<Data>();

    it("check object field", () => {
      expectTypeOf(data.createdAt).toEqualTypeOf<Date>();
      expect(data.createdAt).toEqual(testData.createdAt);
    });

    it("check array value", () => {
      expectTypeOf(data.arrayDate[0]).toEqualTypeOf<Date>();
      expect(data.arrayDate[0]).toEqual(testData.arrayDate[0]);
    });

    it("check union value", () => {
      expectTypeOf(data.testUnion).toEqualTypeOf<number | Date>();
      expect(data.testUnion).toEqual(testData.testUnion);
    });

    it("check custom class type", () => {
      expectTypeOf(data.class).toEqualTypeOf<Test>();
      expect(data.class.name).toEqual(testData.class.name);
    });
  });
});
