import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://www.insee.fr/fr/metadonnees/nafr2
const executeWithRateLimiting = apiRateLimiter("apiNaf", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://www.insee.fr/fr/metadonnees/nafr2",
    timeout: 5000,
  }),
});

export const getNafFromCode = (naf: string) => {
  return executeWithRateLimiting(async (client) => {
    try {
      logger.debug(`[Naf API] Search naf data ${naf}...`);
      const response = await client.post(`consultation`, {
        facetsQuery: [],
        filters: [],
        q: naf,
        rows: 100,
        start: 0,
      });

      return response.data.documents[0];
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal(`api.naf: unable to get naf ${naf}`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.naf: unable to get naf ${naf}`), error);
    }
  });
};
