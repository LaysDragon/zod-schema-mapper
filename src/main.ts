import { Scalars, z } from "zod";
import { ZodTypeConvert } from "./type.js";
import { ZodInstaceOfClass, zodInstaceOfClassTypeName } from "./custom.js";

type ZodTypeTester<Source extends T, T = any> = (schema: T) => schema is Source;
type ZodTypeMapper<S extends z.ZodTypeAny, M extends z.ZodTypeAny> = (
  schema: S
) => M;

interface ZodTypeConstructor<T extends z.ZodTypeAny = z.ZodTypeAny> {
  new (...args: any): T;
}

function directTypeConverters(types: [ZodTypeConstructor, string][]) {
  return types.map((type) => ({
    type: type[0],
    typeName: type[1],
    convert: (schema: z.ZodTypeAny) => {
      return schema;
    },
  }));
}

interface ZodTypeConverter<T extends z.ZodTypeAny> {
  type: ZodTypeConstructor<T>;
  typeName: string;
  convert: (
    type: T,
    test: ZodTypeTester<any>,
    mapper: ZodTypeMapper<any, any>
  ) => z.ZodTypeAny;
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

const directZodType: Array<[ZodTypeConstructor, string]> = [
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
] as const;

const typeConverters: ZodTypeConverter<any>[] = [
  {
    type: z.ZodObject,
    typeName: z.ZodFirstPartyTypeKind.ZodObject,
    convert: (schema: z.ZodObject<any, any, any, any, any>, test, mapper) => {
      let newObjShape: z.ZodRawShape = {};
      for (let name in schema.shape) {
        let fieldSchema = schema.shape[name] as z.ZodTypeAny;
        newObjShape[name] = convertSchemaRecurisive(fieldSchema, test, mapper);
      }
      return z.object(newObjShape);
    },
  },
  {
    type: z.ZodArray,
    typeName: z.ZodFirstPartyTypeKind.ZodArray,
    convert: (schema: z.ZodArray<any, any>, test, mapper) => {
      let elementSchema = schema.element as z.ZodTypeAny;
      return z.array(convertSchemaRecurisive(elementSchema, test, mapper));
    },
  },
  {
    type: z.ZodUnion,
    typeName: z.ZodFirstPartyTypeKind.ZodUnion,
    convert: (schema: z.ZodUnion<any>, test, mapper) => {
      let newUnionTypes: z.ZodTypeAny[] = [];
      for (let optionSchema of schema.options) {
        newUnionTypes.push(convertSchemaRecurisive(optionSchema, test, mapper));
      }
      return z.union(
        newUnionTypes as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
      );
    },
  },
  ...directTypeConverters(directZodType),
];

export function convertSchemaRecurisive<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny
>(
  schema: ZType,
  test: ZodTypeTester<Target>,
  mapper: ZodTypeMapper<Target, DestMapper>
): ZodTypeConvert<ZType, Target, DestMapper> {
  if (test(schema as any)) {
    return mapper(schema as unknown as Target) as unknown as ZodTypeConvert<
      ZType,
      Target,
      DestMapper
    >;
  } else {
    for (let converter of typeConverters) {
      // if (schema instanceof converter.type) {
      if (schema._def.typeName == converter.typeName) {
        return converter.convert(schema, test, mapper) as ZodTypeConvert<
          ZType,
          Target,
          DestMapper
        >;
      }
    }
    throw new Error(`Unsupported schema type ${schema.constructor.name}`);
  }
}

export function convertSchema<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny
>(
  schema: ZType,
  test: ZodTypeTester<Target>,
  mapper: ZodTypeMapper<Target, DestMapper>
) {
  return {
    convert<Target extends z.ZodTypeAny, DestMapper extends z.ZodTypeAny>(
      test: ZodTypeTester<Target>,
      mapper: ZodTypeMapper<Target, DestMapper>
    ) {
      return convertSchema(this.schema(), test, mapper);
    },
    schema: () => convertSchemaRecurisive(schema, test, mapper),
  };
}

function createMidMapper<
  DestSchema extends z.ZodTypeAny,
  TargetSchema extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  TargetMapper extends z.ZodTypeAny
>(
  destSchema: DestSchema,
  targetSchema: TargetSchema,
  test: ZodTypeTester<Target>,
  destMapper: ZodTypeMapper<Target, DestMapper>,
  targetMapper: ZodTypeMapper<Target, TargetMapper>
) {
  let mapper = {
    encode: convertSchema(destSchema, test, destMapper).schema(),
    decode: convertSchema(targetSchema, test, targetMapper).schema(),
  };
  return {
    create<
      Target extends z.ZodTypeAny,
      DestMapper extends z.ZodTypeAny,
      TargetMapper extends z.ZodTypeAny
    >(
      test: ZodTypeTester<Target>,
      destMapper: ZodTypeMapper<Target, DestMapper>,
      targetMapper: ZodTypeMapper<Target, TargetMapper>
    ) {
      let mapper = this.mapper();
      return createMidMapper(
        mapper.encode,
        mapper.decode,
        test,
        destMapper,
        targetMapper
      );
    },
    mapper: () => mapper,
  };
}

export function createMapper<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  TargetMapper extends z.ZodTypeAny
>(
  schema: ZType,
  test: ZodTypeTester<Target>,
  destMapper: ZodTypeMapper<Target, DestMapper>,
  targetMapper: ZodTypeMapper<Target, TargetMapper>
) {
  return createMidMapper(schema, schema, test, destMapper, targetMapper);
}
