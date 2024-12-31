import { Test } from "./model.js";
import { z } from "zod";
import { ZodInstaceOfClass } from "../src/custom.js";
export declare function jsonSchemaMapper<ZType extends z.ZodTypeAny>(schema: ZType): {
    encode: import("../src/type.js").ZodTypeConvert<import("../src/type.js").ZodTypeConvert<import("../src/type.js").ZodTypeConvert<ZType, z.ZodDate, z.ZodEffects<z.ZodDate, string, Date>>, z.ZodNumber, z.ZodEffects<z.ZodNumber, string, number>>, ZodInstaceOfClass<typeof Test>, z.ZodEffects<ZodInstaceOfClass<typeof Test>, string | undefined, Test>>;
    decode: import("../src/type.js").ZodTypeConvert<import("../src/type.js").ZodTypeConvert<import("../src/type.js").ZodTypeConvert<ZType, z.ZodDate, z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodDate>>, z.ZodNumber, z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>, ZodInstaceOfClass<typeof Test>, z.ZodPipeline<z.ZodEffects<z.ZodString, Test, string>, ZodInstaceOfClass<typeof Test>>>;
};
