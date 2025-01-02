# Zod Schema Mapper

zod schema type mapper,its can create new schema base on existed zod schema with condition type tester.

## Example

### Schema

```ts
export const dataSchema = z.object({
  id: z.string(),
  age: z.number(),
  createdAt: z.date(),
  arrayDate: z.date().array(),
  arrayNumber: z.number().array(),
  testUnion: z.number().or(z.date()),
});

export type Data = z.infer<typeof dataSchema>;
// type Data = {
//   id: string;
//   age: number;
//   createdAt: Date;
//   arrayDate: Date[];
//   arrayNumber: number[];
//   testUnion: number | Date;
// }

export const data: Data = {
  age: 1,
  id: "1",
  createdAt: new Date("2024-12-31T10:51:52.587Z"),
  arrayDate: [new Date("2024-12-31T10:51:52.587Z")],
  arrayNumber: [1, 2, 3],
  testUnion: 1,
};
```

### Single Converter

```ts
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
```

### Mapper

```ts
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

type Json = z.infer<typeof jsonMapper.encode>;
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

console.log(jsonMapper.encode.parse(data));
//   {
//     id: '1',
//     age: '1',
//     createdAt: '2024-12-31T10:51:52.587Z',
//     arrayDate: [ '2024-12-31T10:51:52.587Z' ],
//     arrayNumber: [ '1', '2', '3' ],
//     testUnion: '1'
//   }
console.log(jsonMapper.decode.parse(jsonData));
//   {
//     id: '1',
//     age: 1,
//     createdAt: 2024-12-31T10:51:52.587Z,
//     arrayDate: [ 2024-12-31T10:51:52.587Z ],
//     arrayNumber: [ 1, 2, 3 ],
//     testUnion: 1
//   }
```

## custom and instanceof

- z.custom
- z.instanceof

~~Since `z.custom` & `z.instanceOf` just combined ZodAny with superRefine,doesnt have existed ZodType class.
I have no way to indetify their schema in runtime.:(~~  

ok,appearent there is workaround. But can only indetify schema base on instance instead of runtime class type or more general way. check [example](#example-with-zod-schema)

`z.instanceof` can replaced with `instanceOfClass`(`ZodInstaceOfClass`) class come with package provide some helper functions.  
`instanceOfClass` support private constructor.

### example with ZodInstaceOfClass

```ts
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

type Json = z.infer<typeof jsonMapper.encode>;
// type Json = {
//   value: string | undefined;
// }

const jsonData: Json = {
  value: "hello world",
};

console.log(jsonMapper.encode.parse(data));
// { value: 'hello world' }
console.log(jsonMapper.decode.parse(jsonData));
// { value: Test { name: 'hello world' } }
```

### example with zod schema

```ts
const testSchema = z.instanceof(Test);

export const dataSchema = z.object({
  //   value: z.instanceof(Test),
  value: testSchema,
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
  (schema) => isSchema(testSchema, schema), // type prediction helper method come with package
  (schema) => schema.transform((value) => value.name),
  (schema) =>
    z
      .string()
      .transform((value) => new Test(value))
      .pipe(schema)
).mapper();
```

## Support Type

- [x] ZodString
- [x] ZodNumber
- [x] ZodNaN
- [x] ZodBigInt
- [x] ZodBoolean
- [x] ZodDate
- [x] ZodLiteral
- [x] ZodObject
- [x] ZodArray
- [x] ZodUnion

### WIP

- [ ] ZodLazy
- [ ] ZodPromise
- [ ] ZodFunction
- [ ] ZodMap
- [ ] ZodSet
- [ ] ZodRecord
- [ ] ZodNull
- [ ] ZodNullable
- [ ] ZodOptional
- [ ] ZodEnum
- [ ] ZodNever
- [ ] ZodTuple
- [ ] ZodUndefined
