import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zControlsRoutes = {
  post: {
    "/controls/email": {
      method: "post",
      path: "/controls/email",
      body: z
        .object({
          email: z.string().email(),
        })
        .passthrough(),
      response: {
        "2xx": z.any(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
