import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zCerfaRoutes = {
  post: {
    "/cerfa": {
      method: "post",
      path: "/cerfa",
      body: z
        .object({
          values: z.record(z.any()),
          errors: z.record(z.any()),
          output: z
            .object({
              include_errors: z.boolean().optional(),
              include_guide: z.boolean().optional(),
            })
            .strict()
            .optional(),
        })
        .strict(),
      response: {
        "2xx": z.any(),
      },
    },
  },
} as const satisfies IRoutesDef;
