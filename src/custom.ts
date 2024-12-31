import { addIssueToContext, z } from "zod";

abstract class Class {
  constructor(..._: any[]) {}
}

export const zodInstaceOfClassTypeName = "ZodInstaceOfClass";

export interface ZodInstaceOfClassDef<T extends typeof Class>
  extends z.ZodTypeDef {
  typeName: typeof zodInstaceOfClassTypeName;
  cls: T;
}

export class ZodInstaceOfClass<T extends typeof Class> extends z.ZodType<
  InstanceType<T>,
  ZodInstaceOfClassDef<T>,
  InstanceType<T>
> {
  override _parse(input: z.ParseInput): z.ParseReturnType<InstanceType<T>> {
    if (!(input.data instanceof this._def.cls)) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: z.ZodIssueCode.custom,
        message: `Input not instance of ${this._def.cls.name}`,
        fatal: true,
      });
      return z.INVALID;
    }

    return z.OK(input.data as InstanceType<T>);
  }

  isClass(cls: Class): cls is T {
    return cls == this._def.cls;
  }

  static isSchema<T extends typeof Class>(
    cls: T,
    schema: ZodInstaceOfClass<any>
  ): schema is ZodInstaceOfClass<T> {
    // return schema instanceof ZodInstaceOfClass && schema.isClass(cls);
    return (
      schema._def.typeName == zodInstaceOfClassTypeName && schema.isClass(cls)
    );
  }

  static create = createZodInstaceOfClass;
}

function createZodInstaceOfClass<T extends typeof Class>(
  cls: T
  //   params?: z.RawCreateParams
) {
  return new ZodInstaceOfClass<T>({
    cls: cls,
    typeName: "ZodInstaceOfClass",
    //TODO: zod didnt export processCreateParams
    // ...z.processCreateParams(params),
  });
}

const instanceOfClassType = ZodInstaceOfClass.create;
export { instanceOfClassType as instanceOfClass };
