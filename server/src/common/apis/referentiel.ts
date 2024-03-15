import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://referentiel.apprentissage.beta.gouv.fr/
const apiReferientielClient = apiRateLimiter("apiReferentiel", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://referentiel.apprentissage.beta.gouv.fr/api/v1",
    timeout: 5000,
  }),
});

export const getOrganisme = (siret: string) =>
  apiReferientielClient(async (client) => {
    try {
      logger.debug(`[Referentiel API] Search opco data ${siret}...`);
      const response = await client.get(`organismes/${siret}`);

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        throw internal("api.referentiel: unable to get organisme", { data: error.toJSON() });
      }
      throw withCause(internal("api.referentiel: unable to get organisme"), error);
    }
  });
