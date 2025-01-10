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
// z.ZodNullable;
// z.ZodEnum;
// z.ZodNever

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
  [z.ZodUndefined, z.ZodFirstPartyTypeKind.ZodUndefined],
  [z.ZodNull, z.ZodFirstPartyTypeKind.ZodNull],
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
  {
    type: z.ZodOptional,
    typeName: z.ZodFirstPartyTypeKind.ZodOptional,
    convert: (schema: z.ZodOptional<any>, test, mapper) => {
      return convertSchemaRecurisive(schema.unwrap(), test, mapper).optional();
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

interface MidSchema<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny
> {
  convert<MTarget extends z.ZodTypeAny, MDestMapper extends z.ZodTypeAny>(
    test: ZodTypeTester<MTarget>,
    mapper: ZodTypeMapper<MTarget, MDestMapper>
  ): MidSchema<ZodTypeConvert<ZType, Target, DestMapper>, MTarget, MDestMapper>;
  schema: () => ZodTypeConvert<ZType, Target, DestMapper>;
}

export function convertSchema<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny
>(
  schema: ZType,
  test: ZodTypeTester<Target>,
  mapper: ZodTypeMapper<Target, DestMapper>
): MidSchema<ZType, Target, DestMapper> {
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

type ParseMethod<T> = (data: unknown, params?: Partial<z.ParseParams>) => T;

export type SafeParseReturn<ZType extends z.ZodTypeAny> = z.SafeParseReturnType<
  z.input<ZType>,
  z.output<ZType>
>;

export interface Mapper<
  DestSchema extends z.ZodTypeAny,
  TargetSchema extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  TargetMapper extends z.ZodTypeAny
> {
  encoderSchema: ZodTypeConvert<DestSchema, Target, DestMapper>;
  decoderSchema: ZodTypeConvert<TargetSchema, Target, TargetMapper>;
  encode: ParseMethod<z.output<ZodTypeConvert<DestSchema, Target, DestMapper>>>;
  decode: ParseMethod<
    z.output<ZodTypeConvert<TargetSchema, Target, TargetMapper>>
  >;

  encodeAsync: ParseMethod<
    Promise<z.output<ZodTypeConvert<DestSchema, Target, DestMapper>>>
  >;
  decodeAsync: ParseMethod<
    Promise<z.output<ZodTypeConvert<TargetSchema, Target, TargetMapper>>>
  >;

  encodeSafe: ParseMethod<
    SafeParseReturn<ZodTypeConvert<DestSchema, Target, DestMapper>>
  >;

  decodeSafe: ParseMethod<
    SafeParseReturn<ZodTypeConvert<TargetSchema, Target, TargetMapper>>
  >;

  encodeSafeAsync: ParseMethod<
    Promise<SafeParseReturn<ZodTypeConvert<DestSchema, Target, DestMapper>>>
  >;

  decodeSafeAsync: ParseMethod<
    Promise<SafeParseReturn<ZodTypeConvert<TargetSchema, Target, TargetMapper>>>
  >;
}
export interface MidMapper<
  DestSchema extends z.ZodTypeAny,
  TargetSchema extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  TargetMapper extends z.ZodTypeAny
> {
  create<
    MTarget extends z.ZodTypeAny,
    MDestMapper extends z.ZodTypeAny,
    MTargetMapper extends z.ZodTypeAny
  >(
    test: ZodTypeTester<MTarget>,
    destMapper: ZodTypeMapper<MTarget, MDestMapper>,
    targetMapper: ZodTypeMapper<MTarget, MTargetMapper>
  ): MidMapper<
    ZodTypeConvert<DestSchema, Target, DestMapper>,
    ZodTypeConvert<TargetSchema, Target, TargetMapper>,
    MTarget,
    MDestMapper,
    MTargetMapper
  >;

  mapper: () => Mapper<
    DestSchema,
    TargetSchema,
    Target,
    DestMapper,
    TargetMapper
  >;
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
): MidMapper<DestSchema, TargetSchema, Target, DestMapper, TargetMapper> {
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
      return createMidMapper(
        mapper.encode,
        mapper.decode,
        test,
        destMapper,
        targetMapper
      );
    },
    mapper: () => ({
      encoderSchema: mapper.encode,
      decoderSchema: mapper.decode,
      encode: mapper.encode.parse.bind(mapper.encode),
      decode: mapper.decode.parse.bind(mapper.decode),

      encodeAsync: mapper.encode.parseAsync.bind(mapper.encode),
      decodeAsync: mapper.decode.parseAsync.bind(mapper.decode),

      encodeSafe: mapper.encode.safeParse.bind(mapper.encode),
      decodeSafe: mapper.decode.safeParse.bind(mapper.decode),

      encodeSafeAsync: mapper.encode.safeParseAsync.bind(mapper.encode),
      decodeSafeAsync: mapper.decode.safeParseAsync.bind(mapper.decode),
    }),
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

export function isSchema<T extends z.ZodTypeAny>(
  target: T,
  schema: z.ZodTypeAny
): schema is T {
  return target == schema;
}
