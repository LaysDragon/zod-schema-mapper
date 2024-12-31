import { z } from "zod";

type ZodObjectAny<
  UnknownKeys extends z.UnknownKeysParam = z.UnknownKeysParam,
  Catchall extends z.ZodTypeAny = z.ZodTypeAny
> = z.ZodObject<any, UnknownKeys, Catchall, any, any>;

type ZodArrayAny<Cardinality extends z.ArrayCardinality = "many"> =
  z.ZodArray<any, Cardinality>;

type ZodObjFn<
  T extends z.ZodRawShape,
  UnknownKeys extends z.UnknownKeysParam = z.UnknownKeysParam,
  Catchall extends z.ZodTypeAny = z.ZodTypeAny
> = z.ZodObject<
  T,
  UnknownKeys,
  Catchall,
  z.objectOutputType<T, Catchall, UnknownKeys>,
  z.objectInputType<T, Catchall, UnknownKeys>
>;

export type ZodTypeConvert<
  ZType extends z.ZodTypeAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny
> = ZType extends Target
  ? DestMapper
  : ZType extends ZodObjectAny<infer UnknownKeys, infer Catchall>
  ? ZodTypeConvertObj<ZType, Target, DestMapper, UnknownKeys, Catchall>
  : ZType extends ZodArrayAny<infer Cardinality>
  ? ZodTypeConvertArray<ZType, Target, DestMapper, Cardinality>
  : ZType extends z.ZodUnion<infer Options>
  ? ZodTypeConvertUnion<ZType, Target, DestMapper, Options>
  : ZType;

type ZodTypeConvertUnion<
  ZType extends z.ZodUnion<any>,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  Options extends z.ZodUnionOptions
> = z.ZodUnion<{
  [k in keyof Options]: ZodTypeConvert<Options[k], Target, DestMapper>;
}>;

type ZodTypeConvertObj<
  ZType extends ZodObjectAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  UnknownKeys extends z.UnknownKeysParam = z.UnknownKeysParam,
  Catchall extends z.ZodTypeAny = z.ZodTypeAny
> = ZodObjFn<
  {
    [P in keyof ZType["shape"]]: ZodTypeConvert<
      ZType["shape"][P],
      Target,
      DestMapper
    >;
  },
  UnknownKeys,
  Catchall
>;

type ZodTypeConvertArray<
  ZType extends ZodArrayAny,
  Target extends z.ZodTypeAny,
  DestMapper extends z.ZodTypeAny,
  Cardinality extends z.ArrayCardinality = "many"
> = z.ZodArray<
  ZodTypeConvert<ZType["element"], Target, DestMapper>,
  Cardinality
>;
