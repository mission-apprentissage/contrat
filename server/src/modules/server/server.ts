import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import Boom from "@hapi/boom";
import fastify, {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import { initSentryFastify } from "../../common/services/sentry/sentry";
import config from "../../config";
import { cerfaRoutes } from "./cerfa.routes";
import { controlsRoutes } from "./controls.routes";
import { coreRoutes } from "./core.routes";
import { geoRoutes } from "./geo.routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import { nafRoutes } from "./naf.routes";
import { siretRoutes } from "./siret.routes";
import { tcoRoutes } from "./tco.routes";

export interface Server
  extends FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    ZodTypeProvider
  > {}

export async function bind(app: Server) {
  initSentryFastify(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCookie);

  app.register(fastifyMultipart);
  app.register(fastifyCors, {
    ...(config.env === "local"
      ? {
          origin: true,
          credentials: true,
        }
      : {}),
  });

  app.register(
    async (instance: Server) => {
      registerRoutes({ server: instance });
    },
    { prefix: "/api" }
  );

  app.setNotFoundHandler((req, res) => {
    res.status(404).send(Boom.notFound().output);
  });

  errorMiddleware(app);

  return app;
}

export default async (): Promise<Server> => {
  const app: Server = fastify({
    logger: logMiddleware(),
    trustProxy: 1,
    caseSensitive: false,
  }).withTypeProvider<ZodTypeProvider>();

  return bind(app);
};

type RegisterRoutes = (opts: { server: Server }) => void;

const registerRoutes: RegisterRoutes = ({ server }) => {
  coreRoutes({ server });
  cerfaRoutes({ server });
  controlsRoutes({ server });
  geoRoutes({ server });
  nafRoutes({ server });
  siretRoutes({ server });
  tcoRoutes({ server });
};
