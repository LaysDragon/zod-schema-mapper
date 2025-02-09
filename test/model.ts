import { z } from "zod";
import { instanceOfClass } from "../src/custom.js";

export class Test {
  name: string | undefined;
  constructor(name: string) {
    this.name = name;
  }
}
enum Fruits {
  Apple,
  Banana,
}
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);

export const dataSchema = z.object({
  class: instanceOfClass(Test),
  fish: FishEnum,
  fruit: z.nativeEnum(Fruits),
  id: z.string(),
  name: z.string(),
  age: z.number(),
  undefined: z.undefined(),
  optinal: z.date().optional(),
  optinalData: z.date().optional(),
  createdAt: z.date(),
  expiredAt: z.date(),
  arrayDate: z.date().array(),
  arrayNumber: z.number().array(),
  testUnion: z.number().or(z.date()),
  null: z.null(),
  nullable: z.date().nullable(),
  nullableData: z.date().nullable(),
  testObj: z.object({
    createdAt: z.date(),
    expiredAt: z.date(),
    arrayDate: z.date().array(),
    arrayNumber: z.number().array(),
    testUnion: z.number().or(z.date()),
  }),
  testVoid: z.void(),
  testVoidWithUndefined: z.void(),
});

export type Data = z.infer<typeof dataSchema>;

export const testData: Data = {
  class: new Test("hello world"),
  fish: FishEnum.enum.Salmon,
  fruit: Fruits.Apple,
  id: "1",
  name: "dragon",
  age: 18,
  undefined: undefined,
  createdAt: new Date(),
  expiredAt: new Date(),
  arrayDate: [new Date()],
  arrayNumber: [128],
  testUnion: 59,
  optinal: undefined,
  optinalData: new Date(),
  null: null,
  nullable: null,
  nullableData: new Date(),
  testObj: {
    createdAt: new Date(),
    expiredAt: new Date(),
    arrayDate: [new Date()],
    arrayNumber: [1],
    testUnion: 1,
  },
  testVoidWithUndefined: undefined,
};
