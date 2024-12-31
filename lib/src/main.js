import { z } from "zod";
import { ZodInstaceOfClass, zodInstaceOfClassTypeName } from "./custom.js";
function directTypeConverters(types) {
    return types.map((type) => ({
        type: type[0],
        typeName: type[1],
        convert: (schema) => {
            return schema;
        },
    }));
}
// TODO: add missing type
// z.ZodFunction;
// z.ZodMap;
// z.ZodSet;
// z.ZodRecord;
// z.ZodNull;
// z.ZodNullable;
// z.ZodOptional;
// z.ZodEnum;
// z.ZodNever
// z.ZodUndefined
const directZodType = [
    [z.ZodString, z.ZodFirstPartyTypeKind.ZodString],
    [z.ZodNumber, z.ZodFirstPartyTypeKind.ZodNumber],
    [z.ZodNaN, z.ZodFirstPartyTypeKind.ZodNaN],
    [z.ZodBigInt, z.ZodFirstPartyTypeKind.ZodBigInt],
    [z.ZodBoolean, z.ZodFirstPartyTypeKind.ZodBoolean],
    [z.ZodDate, z.ZodFirstPartyTypeKind.ZodDate],
    [z.ZodLiteral, z.ZodFirstPartyTypeKind.ZodLiteral],
    [z.ZodEffects, z.ZodFirstPartyTypeKind.ZodEffects],
    [z.ZodPipeline, z.ZodFirstPartyTypeKind.ZodPipeline],
    [ZodInstaceOfClass, zodInstaceOfClassTypeName],
];
const typeConverters = [
    {
        type: z.ZodObject,
        typeName: z.ZodFirstPartyTypeKind.ZodObject,
        convert: (schema, test, mapper) => {
            let newObjShape = {};
            for (let name in schema.shape) {
                let fieldSchema = schema.shape[name];
                newObjShape[name] = convertSchemaRecurisive(fieldSchema, test, mapper);
            }
            return z.object(newObjShape);
        },
    },
    {
        type: z.ZodArray,
        typeName: z.ZodFirstPartyTypeKind.ZodArray,
        convert: (schema, test, mapper) => {
            let elementSchema = schema.element;
            return z.array(convertSchemaRecurisive(elementSchema, test, mapper));
        },
    },
    {
        type: z.ZodUnion,
        typeName: z.ZodFirstPartyTypeKind.ZodUnion,
        convert: (schema, test, mapper) => {
            let newUnionTypes = [];
            for (let optionSchema of schema.options) {
                newUnionTypes.push(convertSchemaRecurisive(optionSchema, test, mapper));
            }
            return z.union(newUnionTypes);
        },
    },
    ...directTypeConverters(directZodType),
];
export function convertSchemaRecurisive(schema, test, mapper) {
    if (test(schema)) {
        return mapper(schema);
    }
    else {
        for (let converter of typeConverters) {
            // if (schema instanceof converter.type) {
            if (schema._def.typeName == converter.typeName) {
                return converter.convert(schema, test, mapper);
            }
        }
        throw new Error(`Unsupported schema type ${schema.constructor.name}`);
    }
}
export function convertSchema(schema, test, mapper) {
    return {
        convert(test, mapper) {
            return convertSchema(this.schema(), test, mapper);
        },
        schema: () => convertSchemaRecurisive(schema, test, mapper),
    };
}
function createMidMapper(destSchema, targetSchema, test, destMapper, targetMapper) {
    let mapper = {
        encode: convertSchema(destSchema, test, destMapper).schema(),
        decode: convertSchema(targetSchema, test, targetMapper).schema(),
    };
    return {
        create(test, destMapper, targetMapper) {
            let mapper = this.mapper();
            return createMidMapper(mapper.encode, mapper.decode, test, destMapper, targetMapper);
        },
        mapper: () => mapper,
    };
}
export function createMapper(schema, test, destMapper, targetMapper) {
    return createMidMapper(schema, schema, test, destMapper, targetMapper);
}
//# sourceMappingURL=main.js.map