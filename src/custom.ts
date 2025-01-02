import { addIssueToContext, z } from "zod";

type Class = typeof PublicClass | typeof PrivateClass;

abstract class PublicClass {
  constructor(..._: any[]) {}
}

abstract class PrivateClass {
  private constructor(..._: any[]) {}
}

// solution come from https://stackoverflow.com/a/74657881/9708333
type GenericInstanceType<TClass> = InstanceType<{ new (): never } & TClass>;

export const zodInstaceOfClassTypeName = "ZodInstaceOfClass";

export interface ZodInstaceOfClassDef<T extends Class> extends z.ZodTypeDef {
  typeName: typeof zodInstaceOfClassTypeName;
  cls: T;
}

export class ZodInstaceOfClass<T extends Class> extends z.ZodType<
  GenericInstanceType<T>,
  ZodInstaceOfClassDef<T>,
  GenericInstanceType<T>
> {
  override _parse(
    input: z.ParseInput
  ): z.ParseReturnType<GenericInstanceType<T>> {
    if (!(input.data instanceof this._def.cls)) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: z.ZodIssueCode.custom,
        message: `Input not instance of '${this._def.cls.name}',get '${input.data.constructor.name}' instead`,
        fatal: true,
      });
      return z.INVALID;
    }

    return z.OK(input.data as GenericInstanceType<T>);
  }

  isClass(cls: PublicClass): cls is T {
    return cls == this._def.cls;
  }

  static isSchema<T extends typeof PublicClass>(
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

function createZodInstaceOfClass<T extends Class>(
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
