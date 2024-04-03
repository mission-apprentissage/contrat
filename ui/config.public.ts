export interface PublicConfig {
  sentry: {
    dsn: string;
  };
  host: string;
  baseUrl: string;
  apiEndpoint: string;
  env: "local" | "preview" | "recette" | "production";
  version: string;
  productMeta: {
    productName: string;
    repoName: string;
  };
  plausible?: string;
}

function getProductionPublicConfig(): PublicConfig {
  const host = "contrat.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://3e7602056d8e0df1638f34fc89e7aee5@sentry.apprentissage.beta.gouv.fr/13",
    },
    host,
    baseUrl: `https://${host}`,
    env: "production",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
    plausible: "https://plausible.io/share/contrat.apprentissage.beta.gouv.fr?auth=CtGFm-ycrH9-Q8OSRu9EP",
  };
}

function getRecettePublicConfig(): PublicConfig {
  const host = "contrat-recette.apprentissage.beta.gouv.fr";

  return {
    sentry: {
      dsn: "https://3e7602056d8e0df1638f34fc89e7aee5@sentry.apprentissage.beta.gouv.fr/13",
    },
    host,
    baseUrl: `https://${host}`,
    env: "recette",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
    plausible: "https://plausible.io/share/contrat-recette.apprentissage.beta.gouv.fr?auth=hRwxKp7jzbxXrRhjXAvDf",
  };
}

function getPreviewPublicConfig(): PublicConfig {
  const version = getVersion();
  const matches = version.match(/^0\.0\.0-(\d+)$/);

  if (!matches) {
    throw new Error(`getPreviewPublicConfig: invalid preview version ${version}`);
  }

  const host = `${matches[1]}.contrat-preview.apprentissage.beta.gouv.fr`;

  return {
    sentry: {
      dsn: "https://3e7602056d8e0df1638f34fc89e7aee5@sentry.apprentissage.beta.gouv.fr/13",
    },
    host,
    baseUrl: `https://${host}`,
    env: "preview",
    apiEndpoint: `https://${host}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getLocalPublicConfig(): PublicConfig {
  const host = "localhost";
  return {
    sentry: {
      dsn: "https://3e7602056d8e0df1638f34fc89e7aee5@sentry.apprentissage.beta.gouv.fr/13",
    },
    host,
    baseUrl: `http://${host}:3000`,
    env: "local",
    apiEndpoint: `http://${host}:${process.env.NEXT_PUBLIC_API_PORT ?? 5000}/api`,
    version: getVersion(),
    productMeta: getProductMeta(),
  };
}

function getVersion(): string {
  const version = process.env.NEXT_PUBLIC_VERSION;

  if (!version) {
    throw new Error("missing NEXT_PUBLIC_VERSION env-vars");
  }

  return version;
}

function getProductMeta(): PublicConfig["productMeta"] {
  const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME;

  if (!productName) {
    throw new Error("missing NEXT_PUBLIC_PRODUCT_NAME env-vars");
  }

  const repoName = process.env.NEXT_PUBLIC_PRODUCT_REPO;

  if (!repoName) {
    throw new Error("missing NEXT_PUBLIC_PRODUCT_REPO env-vars");
  }

  return { productName, repoName };
}

function getEnv(): PublicConfig["env"] {
  const env = process.env.NEXT_PUBLIC_ENV;
  switch (env) {
    case "production":
    case "recette":
    case "preview":
    case "local":
      return env;
    default:
      throw new Error(`Invalid NEXT_PUBLIC_ENV env-vars ${env}`);
  }
}

function getPublicConfig(): PublicConfig {
  switch (getEnv()) {
    case "production":
      return getProductionPublicConfig();
    case "recette":
      return getRecettePublicConfig();
    case "preview":
      return getPreviewPublicConfig();
    case "local":
      return getLocalPublicConfig();
  }
}

export const publicConfig: PublicConfig = getPublicConfig();
