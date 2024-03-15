import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import config from "../../config";
import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

// Cf Documentation : https://doc.entreprise.api.gouv.fr/#param-tres-obligatoires
const apiEntrepriseClient = apiRateLimiter("apiEntreprise", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://entreprise.api.gouv.fr/v3",
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${config.apiEntreprise}`,
    },
  }),
});

const apiParams = {
  context: "CERFA MNA",
  recipient: "13002526500013", // Siret Dinum
  object: "Construction d'un générateur de CERFA pour les contrats privé d'apprentissage",
  non_diffusables: true,
};

export const getEntreprisePart = (endpoint: string) => {
  return apiEntrepriseClient(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching entreprise part ${endpoint}...`);
      const response = await client.get(endpoint, {
        params: apiParams,
      });

      return response.data.data;
    } catch (error) {
      if (error.message === "timeout of 5000ms exceeded") {
        return null;
      }
      if (error.response.status === 404) {
        return null;
      }

      if (isAxiosError(error)) {
        throw internal(`api.entreprise: unable to get part entreprise ${endpoint}`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.entreprise: unable to get part entreprise ${endpoint}`), error);
    }
  });
};

export const getEntreprise = async (siren: string) => {
  // fetch all parts in parallel
  const [entreprise, siege_social, numero_tva, extrait_kbis] = await Promise.all([
    getEntreprisePart(`insee/sirene/unites_legales/diffusibles/${siren}`),
    getEntreprisePart(`insee/sirene/unites_legales/${siren}/diffusibles/siege_social`),
    // not critical, so we catch errors
    getEntreprisePart(`european_commission/unites_legales/${siren}/numero_tva`).catch(() => null),
    getEntreprisePart(`infogreffe/rcs/unites_legales/${siren}/extrait_kbis`).catch(() => null),
  ]);

  return {
    ...entreprise,
    siege_social,
    numero_tva,
    extrait_kbis,
  };
};

export const getEtablissement = async (siret: string) => {
  return apiEntrepriseClient(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching etablissement ${siret}...`);
      const response = await client.get(`insee/sirene/etablissements/diffusibles/${siret}`, {
        params: apiParams,
      });

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal(`api.entreprise: unable to get etablissement`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.entreprise: unable to get etablissement`), error);
    }
  });
};
export const getConventionCollective = async (siret: string) => {
  return apiEntrepriseClient(async (client) => {
    try {
      logger.debug(`[Entreprise API] Fetching convention collective ${siret}...`);
      const response = await client.get(
        `fabrique_numerique_ministeres_sociaux/etablissements/${siret}/conventions_collectives`,
        {
          params: apiParams,
        }
      );

      return response.data.data[0].data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { active: null, date_publication: null, etat: null, titre_court: null, titre: null, url: null };
        }

        throw internal(`api.entreprise: unable to get convention collective`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.entreprise: unable to get convention collective`), error);
    }
  });
};
