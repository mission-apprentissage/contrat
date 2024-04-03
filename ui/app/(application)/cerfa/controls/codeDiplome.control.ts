import { getTypeDiplomeFromCodeDiplome } from "shared/constants/diplomes";
import { CerfaControl } from "shared/helpers/cerfa/types/cerfa.types";

import { fetchCfdrncp } from "./utils/api.utils";

export const codeDiplomeControl: CerfaControl[] = [
  {
    deps: ["formation.codeDiplome"],
    process: async ({ values, signal }) => {
      const cfd = values.formation.codeDiplome;

      try {
        const { messages, result, error } = await fetchCfdrncp({
          cfd,
          signal,
        });

        if (error) {
          return { error };
        }
        if (messages?.rncps[0].messages !== "Ok") {
          return { error: messages?.code_rncp };
        }

        const selectedRNCP = result.rncps[0]; // TODO métier

        return {
          cascade: {
            "formation.rncp": { value: selectedRNCP.code_rncp, cascade: false },
            "formation.intituleQualification": { value: selectedRNCP.intitule_diplome },
          },
        };
      } catch (error) {
        return {};
      }
    },
  },

  {
    deps: ["formation.codeDiplome"],
    process: async ({ values }) => {
      const cfd = values.formation.codeDiplome as string;

      if (cfd?.length < 3) {
        return {};
      }

      const diplome = getTypeDiplomeFromCodeDiplome(cfd);

      if (!diplome) {
        return {};
      }

      return {
        cascade: {
          "formation.typeDiplome": { value: diplome, cascade: false, success: true },
        },
      };
    },
  },
];
