import { z } from "zod";

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
