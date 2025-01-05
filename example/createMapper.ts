import { z } from "zod";
import { createMapper } from "../src/main.js";
import { data, dataSchema } from "./data.js";

const jsonMapper = createMapper(
  dataSchema,
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
  .mapper();

type Json = z.infer<typeof jsonMapper.encoderSchema>;
// type Json = {
//   id: string;
//   age: string;
//   createdAt: string;
//   arrayDate: string[];
//   arrayNumber: string[];
//   testUnion: string;
// }

const jsonData: Json = {
  age: "1",
  id: "1",
  createdAt: "2024-12-31T10:51:52.587Z",
  arrayDate: ["2024-12-31T10:51:52.587Z"],
  arrayNumber: ["1", "2", "3"],
  testUnion: "1",
};

console.log(jsonMapper.encode(data));
//   {
//     id: '1',
//     age: '1',
//     createdAt: '2024-12-31T10:51:52.587Z',
//     arrayDate: [ '2024-12-31T10:51:52.587Z' ],
//     arrayNumber: [ '1', '2', '3' ],
//     testUnion: '1'
//   }
console.log(jsonMapper.decode(jsonData));
//   {
//     id: '1',
//     age: 1,
//     createdAt: 2024-12-31T10:51:52.587Z,
//     arrayDate: [ 2024-12-31T10:51:52.587Z ],
//     arrayNumber: [ 1, 2, 3 ],
//     testUnion: 1
//   }
