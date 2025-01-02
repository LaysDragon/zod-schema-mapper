import { z } from "zod";
import { createMapper } from "../src/main";
import { instanceOfClass, ZodInstaceOfClass } from "../src/custom";

export class Test {
  name: string | undefined;
  constructor(name: string) {
    this.name = name;
  }
}

export const dataSchema = z.object({
//   value: z.instanceof(Test),
  value: instanceOfClass(Test),
});

export type Data = z.infer<typeof dataSchema>;
// type Data = {
//   value: Test;
// }

export const data: Data = {
  value: new Test("hello world"),
};

const jsonMapper = createMapper(
  dataSchema,
  (schema) => ZodInstaceOfClass.isSchema(Test, schema),
  (schema) => schema.transform((value) => value.name),
  (schema) =>
    z
      .string()
      .transform((value) => new Test(value))
      .pipe(schema)
).mapper();

type Json = z.infer<typeof jsonMapper.encoderSchema>;
// type Json = {
//   value: string | undefined;
// }

const jsonData: Json = {
  value: "hello world",
};

console.log(jsonMapper.encode(data));
// { value: 'hello world' }
console.log(jsonMapper.decode(jsonData));
// { value: Test { name: 'hello world' } }
