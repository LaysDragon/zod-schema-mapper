import { z } from "zod";
declare abstract class Class {
    constructor(..._: any[]);
}
export declare const zodInstaceOfClassTypeName = "ZodInstaceOfClass";
export interface ZodInstaceOfClassDef<T extends typeof Class> extends z.ZodTypeDef {
    typeName: typeof zodInstaceOfClassTypeName;
    cls: T;
}
export declare class ZodInstaceOfClass<T extends typeof Class> extends z.ZodType<InstanceType<T>, ZodInstaceOfClassDef<T>, InstanceType<T>> {
    _parse(input: z.ParseInput): z.ParseReturnType<InstanceType<T>>;
    isClass(cls: Class): cls is T;
    static isSchema<T extends typeof Class>(cls: T, schema: ZodInstaceOfClass<any>): schema is ZodInstaceOfClass<T>;
    static create: typeof createZodInstaceOfClass;
}
declare function createZodInstaceOfClass<T extends typeof Class>(cls: T): ZodInstaceOfClass<T>;
declare const instanceOfClassType: typeof createZodInstaceOfClass;
export { instanceOfClassType as instanceOfClass };
