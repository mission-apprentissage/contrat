import { zNafRoutes } from "shared/routes/naf.routes";

import { getNafFromCode } from "../../common/apis/naf";
import { Server } from "./server";

export const nafRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/naf",
    {
      schema: zNafRoutes.post["/naf"],
    },
    async (request, response) => {
      const { naf } = request.body;
      const nafResponse = await getNafFromCode(naf);
      if (!nafResponse) {
        response.send({ error: "Ce code naf n'existe pas" });
      }
      const { noteLiteral: _, ...result } = nafResponse;
      return response.status(200).send(result);
    }
  );
};
