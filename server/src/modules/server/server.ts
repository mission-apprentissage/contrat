import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger, { FastifyStaticSwaggerOptions, StaticDocumentSpec } from "@fastify/swagger";
import fastifySwaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import Boom from "@hapi/boom";
import fastify, {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { generateOpenApiSchema } from "shared/helpers/openapi/generateOpenapi";
import { IRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";

import { initSentryFastify } from "../../common/services/sentry/sentry";
import config from "../../config";
import { userAdminRoutes } from "./admin/user.routes";
import { authRoutes } from "./auth.routes";
import { cerfaRoutes } from "./cerfa.routes";
import { controlsRoutes } from "./controls.routes";
import { coreRoutes } from "./core.routes";
import { emailsRoutes } from "./emails.routes";
import { geoRoutes } from "./geo.routes";
import { auth } from "./middlewares/authMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import { nafRoutes } from "./naf.routes";
import { siretRoutes } from "./siret.routes";
import { tcoRoutes } from "./tco.routes";
import { userRoutes } from "./user.routes";

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

  const swaggerOpts: FastifyStaticSwaggerOptions = {
    mode: "static",
    specification: {
      document: generateOpenApiSchema(
        config.version,
        config.env,
        config.env === "local" ? "http://localhost:5001/api" : `${config.publicUrl}/api`
      ) as StaticDocumentSpec["document"],
    },
  };
  await app.register(fastifySwagger, swaggerOpts);

  const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/api/documentation",
    uiConfig: {
      displayOperationId: true,
      operationsSorter: "method",
      tagsSorter: "alpha",
      docExpansion: "list",
      deepLinking: false,
    },
  };
  await app.register(fastifySwaggerUi, swaggerUiOptions);

  app.register(fastifyCookie);
  app.decorate("auth", <S extends IRouteSchema & WithSecurityScheme>(scheme: S) => auth(scheme));

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

export const registerRoutes: RegisterRoutes = ({ server }) => {
  coreRoutes({ server });
  authRoutes({ server });
  userRoutes({ server });
  emailsRoutes({ server });
  userAdminRoutes({ server });
  cerfaRoutes({ server });
  controlsRoutes({ server });
  geoRoutes({ server });
  nafRoutes({ server });
  siretRoutes({ server });
  tcoRoutes({ server });
};
