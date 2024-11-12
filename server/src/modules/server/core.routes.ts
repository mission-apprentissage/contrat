import { zRoutes } from "shared";

import config from "@/config";

import { Server } from "./server";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get("/healthcheck", { schema: zRoutes.get["/healthcheck"] }, async (request, response) => {
    response.status(200).send({
      name: `${config.productName} Apprentissage API`,
      version: config.version,
      env: config.env,
    });
  });
};
