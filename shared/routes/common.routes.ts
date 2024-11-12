import { Jsonify } from "type-fest";
import { AnyZodObject, z, ZodType } from "zod";

export const ZResError = z
  .object({
    data: z.any().optional(),
    code: z.string().nullish(),
    message: z.string(),
    name: z.string(),
    statusCode: z.number(),
  })
  .strict();

export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;

interface IRouteSchemaCommon {
  path: string;
  querystring?: AnyZodObject;
  headers?: AnyZodObject;
  params?: AnyZodObject;
  response: { [statuscode: `${1 | 2 | 3 | 4 | 5}${string}`]: ZodType };
}

export interface IRouteSchemaGet extends IRouteSchemaCommon {
  method: "get";
}

export interface IRouteSchemaWrite extends IRouteSchemaCommon {
  method: "post" | "put" | "patch" | "delete";
  body?: ZodType;
}

export type IRouteSchema = IRouteSchemaGet | IRouteSchemaWrite;

export type IRoutesDef = {
  get?: Record<string, IRouteSchemaGet>;
  post?: Record<string, IRouteSchemaWrite>;
  put?: Record<string, IRouteSchemaWrite>;
  delete?: Record<string, IRouteSchemaWrite>;
  patch?: Record<string, IRouteSchemaWrite>;
};
