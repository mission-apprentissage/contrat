import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zSiretRoutes = {
  post: {
    "/siret": {
      method: "post",
      path: "/siret",
      body: z
        .object({
          siret: z.string(),
          organismeFormation: z.boolean(),
        })
        .strict(),
      response: {
        "2xx": z.any(),
      },
    },
  },
} as const satisfies IRoutesDef;
