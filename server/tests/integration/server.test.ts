import assert from "assert";
import fastify, { RouteOptions } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { zRoutes } from "shared/index";
import { IRouteSchemaGet, IRouteSchemaWrite } from "shared/routes/common.routes";
import { describe, it } from "vitest";

import { bind } from "../../src/modules/server/server";

describe("server", () => {
  it("should follow shared schema definition", async () => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();
    const routes: Array<RouteOptions & { routePath: string; path: string; prefix: string }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.addHook("onRoute", (r: any) => {
      routes.push(r as RouteOptions & { routePath: string; path: string; prefix: string });
    });
    await bind(app);

    const seen = new Set();

    for (const route of routes) {
      const { routePath, schema, prefix } = route;

      if (prefix !== "/api") {
        continue;
      }

      // Known path aliases
      const normalizedPath = routePath.startsWith("/romelabels")
        ? routePath.replace("/romelabels", "/rome")
        : routePath;

      const methods = Array.isArray(route.method) ? route.method : [route.method];
      for (const method of methods) {
        // HEAD are not part of schema
        if (method === "HEAD" || method === "OPTIONS") {
          continue;
        }

        assert.equal(!!schema, true, `${method} ${routePath}: schema not define in route`);
        // @ts-expect-error
        const sharedSchema: IRouteSchemaWrite | IRouteSchemaGet = zRoutes?.[method.toLowerCase()]?.[normalizedPath];
        assert.equal(!!sharedSchema, true, `${method} ${routePath}: schema not define in shared`);
        assert.equal(schema, sharedSchema, `${method} ${routePath}: schema not match shared schema`);

        seen.add(`${method} ${routePath}`);
      }
    }

    for (const [method, zMethodRoutes] of Object.entries(zRoutes)) {
      for (const path of Object.keys(zMethodRoutes)) {
        if (seen.has(`${method} ${path}`)) {
          assert.fail(`${method} ${path}: schema in shared not used in routes`);
        }
      }
    }
  });
});
