import { zGeoRoutes } from "shared/routes/geo.routes";

import { Server } from "./server";
import { getDataFromCP } from "./utils/geoUtils";

export const geoRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/geo/cp",
    {
      schema: zGeoRoutes.post["/geo/cp"],
    },
    async (request, response) => {
      const { codePostal } = request.body;
      const result = await getDataFromCP(codePostal);

      return response.send(result);
    }
  );
};
