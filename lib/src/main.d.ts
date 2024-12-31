import { z } from "zod";
import { ZodTypeConvert } from "./type.js";
type ZodTypeTester<Source extends T, T = any> = (schema: T) => schema is Source;
type ZodTypeMapper<S extends z.ZodTypeAny, M extends z.ZodTypeAny> = (schema: S) => M;
export declare function convertSchemaRecurisive<ZType extends z.ZodTypeAny, Target extends z.ZodTypeAny, DestMapper extends z.ZodTypeAny>(schema: ZType, test: ZodTypeTester<Target>, mapper: ZodTypeMapper<Target, DestMapper>): ZodTypeConvert<ZType, Target, DestMapper>;
export declare function convertSchema<ZType extends z.ZodTypeAny, Target extends z.ZodTypeAny, DestMapper extends z.ZodTypeAny>(schema: ZType, test: ZodTypeTester<Target>, mapper: ZodTypeMapper<Target, DestMapper>): {
    convert<Target_1 extends z.ZodTypeAny, DestMapper_1 extends z.ZodTypeAny>(test: ZodTypeTester<Target_1>, mapper: ZodTypeMapper<Target_1, DestMapper_1>): {
        convert<Target_2 extends z.ZodTypeAny, DestMapper_2 extends z.ZodTypeAny>(test: ZodTypeTester<Target_2, any>, mapper: ZodTypeMapper<Target_2, DestMapper_2>): {
            convert<Target_3 extends z.ZodTypeAny, DestMapper_3 extends z.ZodTypeAny>(test: ZodTypeTester<Target_3, any>, mapper: ZodTypeMapper<Target_3, DestMapper_3>): {
                convert<Target_4 extends z.ZodTypeAny, DestMapper_4 extends z.ZodTypeAny>(test: ZodTypeTester<Target_4, any>, mapper: ZodTypeMapper<Target_4, DestMapper_4>): {
                    convert<Target_5 extends z.ZodTypeAny, DestMapper_5 extends z.ZodTypeAny>(test: ZodTypeTester<Target_5, any>, mapper: ZodTypeMapper<Target_5, DestMapper_5>): {
                        convert<Target_6 extends z.ZodTypeAny, DestMapper_6 extends z.ZodTypeAny>(test: ZodTypeTester<Target_6, any>, mapper: ZodTypeMapper<Target_6, DestMapper_6>): {
                            convert<Target_7 extends z.ZodTypeAny, DestMapper_7 extends z.ZodTypeAny>(test: ZodTypeTester<Target_7, any>, mapper: ZodTypeMapper<Target_7, DestMapper_7>): {
                                convert<Target_8 extends z.ZodTypeAny, DestMapper_8 extends z.ZodTypeAny>(test: ZodTypeTester<Target_8, any>, mapper: ZodTypeMapper<Target_8, DestMapper_8>): {
                                    convert<Target_9 extends z.ZodTypeAny, DestMapper_9 extends z.ZodTypeAny>(test: ZodTypeTester<Target_9, any>, mapper: ZodTypeMapper<Target_9, DestMapper_9>): {
                                        convert<Target_10 extends z.ZodTypeAny, DestMapper_10 extends z.ZodTypeAny>(test: ZodTypeTester<Target_10, any>, mapper: ZodTypeMapper<Target_10, DestMapper_10>): {
                                            convert<Target_11 extends z.ZodTypeAny, DestMapper_11 extends z.ZodTypeAny>(test: ZodTypeTester<Target_11, any>, mapper: ZodTypeMapper<Target_11, DestMapper_11>): /*elided*/ any;
                                            schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>, Target_9, DestMapper_9>, Target_10, DestMapper_10>;
                                        };
                                        schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>, Target_9, DestMapper_9>;
                                    };
                                    schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>;
                                };
                                schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>;
                            };
                            schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>;
                        };
                        schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>;
                    };
                    schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>;
                };
                schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>;
            };
            schema: () => ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>;
        };
        schema: () => ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>;
    };
    schema: () => ZodTypeConvert<ZType, Target, DestMapper>;
};
export declare function createMapper<ZType extends z.ZodTypeAny, Target extends z.ZodTypeAny, DestMapper extends z.ZodTypeAny, TargetMapper extends z.ZodTypeAny>(schema: ZType, test: ZodTypeTester<Target>, destMapper: ZodTypeMapper<Target, DestMapper>, targetMapper: ZodTypeMapper<Target, TargetMapper>): {
    create<Target_1 extends z.ZodTypeAny, DestMapper_1 extends z.ZodTypeAny, TargetMapper_1 extends z.ZodTypeAny>(test: ZodTypeTester<Target_1, any>, destMapper: ZodTypeMapper<Target_1, DestMapper_1>, targetMapper: ZodTypeMapper<Target_1, TargetMapper_1>): {
        create<Target_2 extends z.ZodTypeAny, DestMapper_2 extends z.ZodTypeAny, TargetMapper_2 extends z.ZodTypeAny>(test: ZodTypeTester<Target_2, any>, destMapper: ZodTypeMapper<Target_2, DestMapper_2>, targetMapper: ZodTypeMapper<Target_2, TargetMapper_2>): {
            create<Target_3 extends z.ZodTypeAny, DestMapper_3 extends z.ZodTypeAny, TargetMapper_3 extends z.ZodTypeAny>(test: ZodTypeTester<Target_3, any>, destMapper: ZodTypeMapper<Target_3, DestMapper_3>, targetMapper: ZodTypeMapper<Target_3, TargetMapper_3>): {
                create<Target_4 extends z.ZodTypeAny, DestMapper_4 extends z.ZodTypeAny, TargetMapper_4 extends z.ZodTypeAny>(test: ZodTypeTester<Target_4, any>, destMapper: ZodTypeMapper<Target_4, DestMapper_4>, targetMapper: ZodTypeMapper<Target_4, TargetMapper_4>): {
                    create<Target_5 extends z.ZodTypeAny, DestMapper_5 extends z.ZodTypeAny, TargetMapper_5 extends z.ZodTypeAny>(test: ZodTypeTester<Target_5, any>, destMapper: ZodTypeMapper<Target_5, DestMapper_5>, targetMapper: ZodTypeMapper<Target_5, TargetMapper_5>): {
                        create<Target_6 extends z.ZodTypeAny, DestMapper_6 extends z.ZodTypeAny, TargetMapper_6 extends z.ZodTypeAny>(test: ZodTypeTester<Target_6, any>, destMapper: ZodTypeMapper<Target_6, DestMapper_6>, targetMapper: ZodTypeMapper<Target_6, TargetMapper_6>): {
                            create<Target_7 extends z.ZodTypeAny, DestMapper_7 extends z.ZodTypeAny, TargetMapper_7 extends z.ZodTypeAny>(test: ZodTypeTester<Target_7, any>, destMapper: ZodTypeMapper<Target_7, DestMapper_7>, targetMapper: ZodTypeMapper<Target_7, TargetMapper_7>): {
                                create<Target_8 extends z.ZodTypeAny, DestMapper_8 extends z.ZodTypeAny, TargetMapper_8 extends z.ZodTypeAny>(test: ZodTypeTester<Target_8, any>, destMapper: ZodTypeMapper<Target_8, DestMapper_8>, targetMapper: ZodTypeMapper<Target_8, TargetMapper_8>): {
                                    create<Target_9 extends z.ZodTypeAny, DestMapper_9 extends z.ZodTypeAny, TargetMapper_9 extends z.ZodTypeAny>(test: ZodTypeTester<Target_9, any>, destMapper: ZodTypeMapper<Target_9, DestMapper_9>, targetMapper: ZodTypeMapper<Target_9, TargetMapper_9>): {
                                        create<Target_10 extends z.ZodTypeAny, DestMapper_10 extends z.ZodTypeAny, TargetMapper_10 extends z.ZodTypeAny>(test: ZodTypeTester<Target_10, any>, destMapper: ZodTypeMapper<Target_10, DestMapper_10>, targetMapper: ZodTypeMapper<Target_10, TargetMapper_10>): {
                                            create<Target_11 extends z.ZodTypeAny, DestMapper_11 extends z.ZodTypeAny, TargetMapper_11 extends z.ZodTypeAny>(test: ZodTypeTester<Target_11, any>, destMapper: ZodTypeMapper<Target_11, DestMapper_11>, targetMapper: ZodTypeMapper<Target_11, TargetMapper_11>): /*elided*/ any;
                                            mapper: () => {
                                                encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>, Target_9, DestMapper_9>, Target_10, DestMapper_10>;
                                                decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>, Target_6, TargetMapper_6>, Target_7, TargetMapper_7>, Target_8, TargetMapper_8>, Target_9, TargetMapper_9>, Target_10, TargetMapper_10>;
                                            };
                                        };
                                        mapper: () => {
                                            encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>, Target_9, DestMapper_9>;
                                            decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>, Target_6, TargetMapper_6>, Target_7, TargetMapper_7>, Target_8, TargetMapper_8>, Target_9, TargetMapper_9>;
                                        };
                                    };
                                    mapper: () => {
                                        encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>, Target_8, DestMapper_8>;
                                        decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>, Target_6, TargetMapper_6>, Target_7, TargetMapper_7>, Target_8, TargetMapper_8>;
                                    };
                                };
                                mapper: () => {
                                    encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>, Target_7, DestMapper_7>;
                                    decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>, Target_6, TargetMapper_6>, Target_7, TargetMapper_7>;
                                };
                            };
                            mapper: () => {
                                encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>, Target_6, DestMapper_6>;
                                decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>, Target_6, TargetMapper_6>;
                            };
                        };
                        mapper: () => {
                            encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>, Target_5, DestMapper_5>;
                            decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>, Target_5, TargetMapper_5>;
                        };
                    };
                    mapper: () => {
                        encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>, Target_4, DestMapper_4>;
                        decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>, Target_4, TargetMapper_4>;
                    };
                };
                mapper: () => {
                    encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>, Target_3, DestMapper_3>;
                    decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>, Target_3, TargetMapper_3>;
                };
            };
            mapper: () => {
                encode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>, Target_2, DestMapper_2>;
                decode: ZodTypeConvert<ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>, Target_2, TargetMapper_2>;
            };
        };
        mapper: () => {
            encode: ZodTypeConvert<ZodTypeConvert<ZType, Target, DestMapper>, Target_1, DestMapper_1>;
            decode: ZodTypeConvert<ZodTypeConvert<ZType, Target, TargetMapper>, Target_1, TargetMapper_1>;
        };
    };
    mapper: () => {
        encode: ZodTypeConvert<ZType, Target, DestMapper>;
        decode: ZodTypeConvert<ZType, Target, TargetMapper>;
    };
};
export {};
