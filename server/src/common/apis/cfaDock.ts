import { internal } from "@hapi/boom";
import { isAxiosError } from "axios";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

interface OpcoData {
  idcc?: string;
  opco_nom?: string;
  opco_siren?: string;
  status?: string;
}

// Cf Documentation : https://www.cfadock.fr/Home/ApiDescription
const cfaDockClient = apiRateLimiter("apiCfaDock", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://www.cfadock.fr/api",
    timeout: 5000,
  }),
});

export const getOpcoData = (siret: string): Promise<Promise<OpcoData>> => {
  return cfaDockClient(async (client) => {
    try {
      logger.debug(`[CfaDock API] Search opco data ${siret}...`);
      const response = await client.get(`opcos/?siret=${siret}`);
      if (!response?.data?.searchStatus) {
        throw internal(`api.cfaDock: No data found for siret=${siret}`);
      }
      return {
        idcc: response.data.idcc,
        opco_nom: response.data.opcoName,
        opco_siren: response.data.opcoSiren,
        status: response.data.searchStatus,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal(`api.cfaDock: unable to get opco data for siret=${siret}`, { data: error.toJSON() });
      }
      throw withCause(internal(`api.cfaDock: unable to get opco data for siret=${siret}`), error);
    }
  });
};
