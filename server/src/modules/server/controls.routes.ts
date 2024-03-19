import dns from "node:dns";

import { zControlsRoutes } from "shared/routes/controls.routes";

import { Server } from "./server";

export const controlsRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/controls/email",
    {
      schema: zControlsRoutes.post["/controls/email"],
    },
    async (request, response) => {
      const { email } = request.body;

      const domain = email.split("@")[1];

      try {
        await dns.promises.lookup(domain);

        return response.status(200).send({ is_valid: true });
      } catch (error) {
        console.error(error);

        if (error.code === "ENOTFOUND") {
          return response.status(200).send({ is_valid: false });
        }

        // unhandled error is considered as valid
        return response.status(200).send({ is_valid: true });
      }
    }
  );
};
