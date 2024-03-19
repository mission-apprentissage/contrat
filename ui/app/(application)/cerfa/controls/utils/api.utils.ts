import { apiPost } from "../../../../../utils/api.utils";

type ErrorReturn = {
  error: string;
};

interface APIServiceCommonParams {
  signal: AbortSignal;
}

type APIServiceAction<T> = (params: T & APIServiceCommonParams) => Promise<any> | ErrorReturn;

interface FetchSiretParams {
  siret: string;
  organismeFormation?: boolean;
}

export const fetchSiret: APIServiceAction<FetchSiretParams> = async ({
  siret,
  organismeFormation = false,
  signal: _signal,
}) => {
  try {
    return apiPost("/siret", {
      body: {
        siret,
        organismeFormation,
      },
    });
  } catch (e: any) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchCodePostalParams {
  codePostal: string;
}

export const fetchCodePostal: APIServiceAction<FetchCodePostalParams> = async ({ codePostal, signal: _signal }) => {
  try {
    return apiPost("/geo/cp", {
      body: {
        codePostal,
      },
    });
  } catch (e: any) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchNafParams {
  naf: string;
}

export const fetchNaf: APIServiceAction<FetchNafParams> = async ({ naf, signal: _signal }) => {
  try {
    return apiPost("/naf", {
      body: {
        naf,
      },
    });
  } catch (e: any) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

interface FetchCfdrncpParams {
  rncp?: string;
  cfd?: string;
}

export const fetchCfdrncp: APIServiceAction<FetchCfdrncpParams> = async ({ rncp, cfd, signal: _signal }) => {
  try {
    return apiPost("/cfdrncp", {
      body: {
        rncp: rncp ?? "",
        cfd: cfd ?? "",
      },
    });
  } catch (e: any) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

export const controlEmail = async (email: string): Promise<{ is_valid?: boolean; error?: string }> => {
  try {
    return apiPost("/controls/email", {
      body: {
        email,
      },
    });
  } catch (e: any) {
    if (e.name === "AbortError") throw e;
    return { error: e.prettyMessage ?? "Une erreur technique est survenue" };
  }
};

export const apiService = {
  fetchSiret,
  fetchCodePostal,
  fetchNaf,
  fetchCfdrncp,
};
