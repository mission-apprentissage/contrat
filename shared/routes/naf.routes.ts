import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zNafRoutes = {
  post: {
    "/naf": {
      method: "post",
      path: "/naf",
      body: z
        .object({
          naf: z.string().regex(new RegExp("^.{1,6}$")),
        })
        .strict(),
      response: {
        "2xx": z.any(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
