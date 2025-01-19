// sum.test.js
import { expect, describe, it, expectTypeOf } from "vitest";
import { Data, dataSchema, Test, testData } from "./model.js";
import { z } from "zod";
import {
  createMapper,
  instanceOfClass,
  ZodInstaceOfClass,
} from "../src/main.js";

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
  type DataJson = z.infer<typeof jsonMapper.encoderSchema>;

  expectTypeOf(jsonMapper.encoderSchema).toMatchTypeOf<z.ZodTypeAny>();

  describe("data to json", () => {
    let jsonData = jsonMapper.encode(testData);

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

    it("check optional value", () => {
      expectTypeOf(jsonData.optinal).toEqualTypeOf<string | undefined>();
      expect(jsonData.optinal).toEqual(undefined);
      expect(jsonData.optinalData).toEqual(testData.optinalData?.toISOString());
    });

    it("check nullable value", () => {
      expectTypeOf(jsonData.nullable).toEqualTypeOf<string | null>();
      expect(jsonData.nullable).toEqual(null);
      expect(jsonData.nullableData).toEqual(
        testData.nullableData?.toISOString()
      );
    });

    it("check void value", () => {
      expectTypeOf(jsonData.testVoid).toEqualTypeOf<void | undefined>();
      expect(jsonData.testVoid).toEqual(undefined);
      expect(jsonData.testVoidWithUndefined).toEqual(undefined);
    });

    it("check custom class type", () => {
      expectTypeOf(jsonData.class).toEqualTypeOf<string | undefined>();
      expect(jsonData.class).toEqual(testData.class.name);
    });
  });

  describe("json to data", () => {
    let jsonData = jsonMapper.encode(testData);
    let data = jsonMapper.decode(jsonData);

    expectTypeOf(data).toEqualTypeOf<Data>();
    expect(data).toEqual(testData);

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

    it("check optional value", () => {
      expectTypeOf(data.optinal).toEqualTypeOf<Date | undefined>();
      expect(data.optinal).toEqual(undefined);
      expect(data.optinalData).toEqual(testData.optinalData);
    });

    it("check nullable value", () => {
      expectTypeOf(data.nullable).toEqualTypeOf<Date | null>();
      expect(data.nullable).toEqual(null);
      expect(data.nullableData).toEqual(testData.nullableData);
    });

    it("check void value", () => {
      expectTypeOf(data.testVoid).toEqualTypeOf<void | undefined>();
      expect(data.testVoid).toEqual(undefined);
      expect(data.testVoidWithUndefined).toEqual(undefined);
    });

    it("check custom class type", () => {
      expectTypeOf(data.class).toEqualTypeOf<Test>();
      expect(data.class.name).toEqual(testData.class.name);
    });
  });
});

describe("instanceOfClass validation", () => {
  const testSchema = z.object({
    value: instanceOfClass(Test),
  });
  it("with valid input", () => {
    const validData = {
      value: new Test("valid"),
    };
    expect(testSchema.safeParse(validData).success).toBeTruthy();
  });

  it("with invalid input", () => {
    class NotTest {}
    const invalidData = {
      value: new NotTest(),
    };
    expect(testSchema.safeParse(invalidData).success).toBeFalsy();
  });

  describe("with private constructor", () => {
    class PrivateTest {
      value: string;
      private constructor(value: string) {
        this.value = value;
      }
      static create(value: string) {
        return new PrivateTest(value);
      }
    }

    const privateTestSchema = z.object({
      value: instanceOfClass(PrivateTest),
    });

    it("with valid input", () => {
      const validData = {
        value: PrivateTest.create("valid"),
      };
      var result = privateTestSchema.safeParse(validData);
      expectTypeOf(result.data!.value).toEqualTypeOf<PrivateTest>();
      expect(result.success).toBeTruthy();
    });

    it("with invalid input", () => {
      class NotTest {}
      const invalidData = {
        value: new NotTest(),
      };
      expect(privateTestSchema.safeParse(invalidData).success).toBeFalsy();
    });
  });
});
