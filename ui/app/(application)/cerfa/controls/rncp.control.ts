import { getTypeDiplomeFromCodeDiplome } from "shared/constants/diplomes";

import { CerfaControl } from ".";
import { fetchCfdrncp } from "./utils/api.utils";

export const rncpControl: CerfaControl[] = [
  {
    deps: ["formation.rncp"],
    process: async ({ values, signal }) => {
      const rncp = values.formation.rncp;

      const { messages, result, error } = await fetchCfdrncp({
        rncp,
        signal,
      });

      if (error) {
        return { error };
      }

      if (messages?.code_rncp !== "Ok") {
        return { error: messages.code_rncp };
      }

      if (result.active_inactive === "INACTIVE") {
        return { error: `Le code ${rncp} est inactif.` };
      }

      if (!result.cfds) {
        return {
          cascade: {
            "formation.codeDiplome": { reset: true, cascade: false },
            "formation.intituleQualification": { value: result.intitule_diplome },
          },
        };
      }

      const firstCfd = result.cfds[0]; // TODO métier

      const diplome = getTypeDiplomeFromCodeDiplome(firstCfd);

      return {
        cascade: {
          "formation.codeDiplome": { value: firstCfd, cascade: false },
          "formation.intituleQualification": { value: result.intitule_diplome },
          "formation.typeDiplome": { value: diplome },
        },
      };
    },
  },
];
