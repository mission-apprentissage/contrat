import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

interface Result {
  siren: string;
  siege: {
    liste_idcc: string[];
  };
}

interface RechercheEntrepriseResponse {
  results: Result[];
}

const apiRechercheEntrepriseClient = apiRateLimiter("apiRechercheEntreprise", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://recherche-entreprises.api.gouv.fr",
    timeout: 5000,
  }),
});

export const getRechercheEntreprise = (siret: string) => {
  return apiRechercheEntrepriseClient(async (client) => {
    try {
      logger.debug(`[Recherche Entreprises Api] Fetching Siret ${siret}...`);
      const response = await client.get<RechercheEntrepriseResponse>("/search", {
        params: {
          q: siret,
        },
      });

      return response.data.results[0];
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal(`api.rechercheEntreprise: unable to get entreprise`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.rechercheEntreprise: unable to get entreprise`), error);
    }
  });
};
