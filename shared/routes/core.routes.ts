import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zCoreRoutes = {
  get: {
    "/healthcheck": {
      method: "get",
      path: "/healthcheck",
      response: {
        "200": z
          .object({
            name: z.string(),
            version: z.string(),
            env: z.enum(["local", "recette", "production", "test"]),
          })
          .describe("API Health")
          .strict(),
      },
    },
  },
} as const satisfies IRoutesDef;
