import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zGeoRoutes = {
  post: {
    "/geo/cp": {
      method: "post",
      path: "/geo/cp",
      body: z
        .object({
          codePostal: z.string().regex(new RegExp("^[0-9]{5}$")),
        })
        .strict(),
      response: {
        "2xx": z.any(),
      },
    },
  },
} as const satisfies IRoutesDef;
