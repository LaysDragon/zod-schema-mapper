import { addIssueToContext, z } from "zod";
class Class {
    constructor(..._) { }
}
export const zodInstaceOfClassTypeName = "ZodInstaceOfClass";
export class ZodInstaceOfClass extends z.ZodType {
    _parse(input) {
        if (!(input.data instanceof this._def.cls)) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: z.ZodIssueCode.custom,
                message: `Input not instance of ${this._def.cls.name}`,
                fatal: true,
            });
            return z.INVALID;
        }
        return z.OK(input.data);
    }
    isClass(cls) {
        return cls == this._def.cls;
    }
    static isSchema(cls, schema) {
        // return schema instanceof ZodInstaceOfClass && schema.isClass(cls);
        return (schema._def.typeName == zodInstaceOfClassTypeName && schema.isClass(cls));
    }
    static create = createZodInstaceOfClass;
}
function createZodInstaceOfClass(cls
//   params?: z.RawCreateParams
) {
    return new ZodInstaceOfClass({
        cls: cls,
        typeName: "ZodInstaceOfClass",
        //TODO: zod didnt export processCreateParams
        // ...z.processCreateParams(params),
    });
}
const instanceOfClassType = ZodInstaceOfClass.create;
export { instanceOfClassType as instanceOfClass };
//# sourceMappingURL=custom.js.map