import { internal } from "@hapi/boom";
import { AxiosInstance, isAxiosError } from "axios";
import queryString from "query-string";

import { withCause } from "../errors/withCause";
import logger from "../logger";
import { apiRateLimiter } from "../utils/apiUtils";
import getApiClient from "./client";

const apiAdresseClient = apiRateLimiter("apiAdresse", {
  nbRequests: 25,
  durationInSeconds: 1,
  client: getApiClient({
    baseURL: "https://api-adresse.data.gouv.fr",
    timeout: 5000,
  }),
});

export const search = async (q: string, options = {}) => {
  return apiAdresseClient(async (client: AxiosInstance) => {
    try {
      const params = queryString.stringify({ q, ...options });
      logger.debug(`[Adresse API] Searching adresse with parameters ${params}...`);
      const response = await client.get(`search/?${params}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal("api.address: unable to search address", { data: error.toJSON() });
      }
      throw withCause(internal("api.address: unable to search address"), error);
    }
  });
};

export const reverse = async (lon: string, lat: string, options = {}) => {
  return apiAdresseClient(async (client) => {
    try {
      const params = queryString.stringify({ lon, lat, ...options });
      logger.debug(`[Adresse API] Reverse geocode with parameters ${params}...`);
      const response = await client.get(`reverse/?${params}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal("api.address: unable to reverse geocode", { data: error.toJSON() });
      }
      throw withCause(internal("api.address: unable to reverse geocode"), error);
    }
  });
};

interface SearchMunicipalityByCodeOptions {
  isCityCode?: boolean;
  codeInsee?: string;
}

export const searchMunicipalityByCode = async (code: string, options: SearchMunicipalityByCodeOptions = {}) => {
  return apiAdresseClient(async (client) => {
    try {
      let query = `${options.isCityCode ? "citycode=" : ""}${code}`;
      if (options.codeInsee) {
        query = `${code}&citycode=${options.codeInsee}`;
      }
      logger.debug(`[Adresse API] Searching municipality with query ${query}...`);
      const response = await client.get(`search/?limit=1&q=${query}&type=municipality`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw internal("api.address: unable to search municipality by code", { data: error.toJSON() });
      }
      throw withCause(internal("api.address: unable to search municipality by code"), error);
    }
  });
};
