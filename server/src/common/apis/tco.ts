import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1/docs/
const apiTcoClient = apiRateLimiter("apiTco", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1",
    timeout: 5000,
  }),
});

export const findCfd = (cfd: string) =>
  apiTcoClient(async (client) => {
    try {
      const response = await client.post(`cfd`, {
        cfd,
      });
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal("api.tco: unable to get cfd", { data: error.toJSON() });
      }
      throw withCause(internal("api.tco: unable to get cfd"), error);
    }
  });

export const findRncp = (rncp: string) =>
  apiTcoClient(async (client) => {
    try {
      logger.debug(`[TCO API] Search rncp data ${rncp}...`);
      const response = await client.post(`rncp`, {
        rncp,
      });
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal("api.tco: unable to get rncp", { data: error.toJSON() });
      }
      throw withCause(internal("api.tco: unable to get rncp"), error);
    }
  });
