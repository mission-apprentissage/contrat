import env from "env-var";

const config = {
  productName: env.get("PUBLIC_PRODUCT_NAME").required().asString(),
  port: env.get("SERVER_PORT").required().asPortNumber(),
  version: env.get("PUBLIC_VERSION").required().asString(),
  env: env.get("ENV").required().asEnum(["local", "recette", "production", "test"]),
  publicUrl: env.get("PUBLIC_URL").required().asString(),
  log: {
    type: env.get("LOG_TYPE").required().asString(),
    level: env.get("LOG_LEVEL").required().asString(),
  },
  apiEntreprise: env.get("MNA_CONTRAT_API_ENTREPRISE_SECRET").asString(),
};

export default config;
