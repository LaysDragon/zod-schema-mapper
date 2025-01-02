import { z } from "zod";
import { convertSchema } from "../src/main";
import { data, dataSchema } from "./data";

const jsonSchema = convertSchema(
  dataSchema,
  (schema) => schema instanceof z.ZodDate,
  (schema) => schema.transform((value) => value.toISOString())
)
  .convert(
    (schema) => schema instanceof z.ZodNumber,
    (schema) => schema.transform((value) => value.toString())
  )
  .schema();

type Json = z.infer<typeof jsonSchema>;
// type Json = {
//   id: string;
//   age: string;
//   createdAt: string;
//   arrayDate: string[];
//   arrayNumber: string[];
//   testUnion: string;
// }

console.log(jsonSchema.parse(data));
// {
//   id: '1',
//   age: '1',
//   createdAt: '2024-12-31T10:51:52.587Z',
//   arrayDate: [ '2024-12-31T10:51:52.587Z' ],
//   arrayNumber: [ '1', '2', '3' ],
//   testUnion: '1'
// }
