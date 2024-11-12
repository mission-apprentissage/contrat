import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zTcoRoutes = {
  post: {
    "/cfdrncp": {
      method: "post",
      path: "/cfdrncp",
      body: z
        .object({
          cfd: z.string().optional(), //.regex(new RegExp("^[0-9A-Z]{8}[A-Z]?$"))
          rncp: z.string().optional(), // .regex(new RegExp("^(RNCP)?[0-9]{2,5}$"))
        })
        .passthrough(),
      response: {
        "2xx": z.any(),
      },
    },
  },
} as const satisfies IRoutesDef;
