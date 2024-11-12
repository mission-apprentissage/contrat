import { ConditionalExcept, EmptyObject, Jsonify } from "type-fest";
import z, { ZodType } from "zod";

import { zCerfaRoutes } from "./cerfa.routes";
import { IRouteSchema, IRouteSchemaWrite } from "./common.routes";
import { zControlsRoutes } from "./controls.routes";
import { zCoreRoutes } from "./core.routes";
import { zGeoRoutes } from "./geo.routes";
import { zNafRoutes } from "./naf.routes";
import { zSiretRoutes } from "./siret.routes";
import { zTcoRoutes } from "./tco.routes";

const zRoutesGet = {
  ...zCoreRoutes.get,
} as const;

const zRoutesPost = {
  ...zCerfaRoutes.post,
  ...zControlsRoutes.post,
  ...zGeoRoutes.post,
  ...zNafRoutes.post,
  ...zSiretRoutes.post,
  ...zTcoRoutes.post,
} as const;

const zRoutesPut = {} as const;

const zRoutesDelete = {} as const;

export type IGetRoutes = typeof zRoutesGet;
export type IPostRoutes = typeof zRoutesPost;
export type IPutRoutes = typeof zRoutesPut;
export type IDeleteRoutes = typeof zRoutesDelete;

export type IRoutes = {
  get: IGetRoutes;
  post: IPostRoutes;
  put: IPutRoutes;
  delete: IDeleteRoutes;
};

export type IRoutesPath = {
  get: keyof IRoutes["get"];
  post: keyof IRoutes["post"];
  put: keyof IRoutes["put"];
  delete: keyof IRoutes["delete"];
};

export const zRoutes: IRoutes = {
  get: zRoutesGet,
  post: zRoutesPost,
  put: zRoutesPut,
  delete: zRoutesDelete,
} as const;

export type IResponse<S extends IRouteSchema> = S["response"][`200`] extends ZodType
  ? Jsonify<z.output<S["response"][`200`]>>
  : S["response"][`2${string}`] extends ZodType
    ? Jsonify<z.output<S["response"][`2${string}`]>>
    : never;

export type IBody<S extends IRouteSchemaWrite> = S["body"] extends ZodType ? z.input<S["body"]> : never;

export type IQuery<S extends IRouteSchema> = S["querystring"] extends ZodType ? z.input<S["querystring"]> : never;

export type IParam<S extends IRouteSchema> = S["params"] extends ZodType ? z.input<S["params"]> : never;

export type IHeaders<S extends IRouteSchema> = S["headers"] extends ZodType
  ? Omit<z.input<S["headers"]>, "referrer">
  : object;

type IRequestRaw<S extends IRouteSchema> = {
  params: IParam<S>;
  querystring: IQuery<S>;
  headers: IHeaders<S> extends EmptyObject ? never : IHeaders<S>;
  body: S extends IRouteSchemaWrite ? IBody<S> : never;
};

export type IRequest<S extends IRouteSchema> = ConditionalExcept<
  IRequestRaw<S>,
  never | EmptyObject
> extends EmptyObject
  ? EmptyObject
  : ConditionalExcept<IRequestRaw<S>, never | EmptyObject>;
