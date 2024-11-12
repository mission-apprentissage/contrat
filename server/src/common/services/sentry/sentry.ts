import fastifySentryPlugin, { FastifySentryOptions } from "@immobiliarelabs/fastify-sentry";
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { FastifyRequest } from "fastify";

import config from "../../../config";
import { Server } from "../../../modules/server/server";

function getOptions(): Sentry.NodeOptions {
  return {
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0,
    tracePropagationTargets: [/^https:\/\/[^/]*\.apprentissage\.beta\.gouv\.fr/],
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Mongo({ useMongoose: false }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new CaptureConsole({ levels: ["error"] }) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new ExtraErrorData({ depth: 16 }) as any,
    ],
  };
}

export function initSentryProcessor(): void {
  Sentry.init(getOptions());
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}

export function initSentryFastify(app: Server) {
  const options: FastifySentryOptions = {
    setErrorHandler: false,
    extractRequestData: (request: FastifyRequest) => {
      return {
        headers: request.headers,
        method: request.method,
        protocol: request.protocol,
        query_string: request.query,
      };
    },
  };

  // @ts-expect-error
  app.register(fastifySentryPlugin, { options, ...getOptions() });
}
