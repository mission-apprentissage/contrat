import { CerfaControl } from "shared/helpers/cerfa/types/cerfa.types";

import { fetchCodePostal } from "./utils/api.utils";

export const organismeFormationCodePostalControl: CerfaControl[] = [
  {
    deps: ["organismeFormation.adresse.codePostal"],
    process: async ({ values, signal }) => {
      const codePostal = values.organismeFormation.adresse.codePostal;
      const { messages, result } = await fetchCodePostal({
        codePostal,
        signal,
      });

      if (messages.cp === "Ok") {
        return {
          cascade: {
            "organismeFormation.adresse.commune": { value: result.commune.trim() },
          },
        };
      }

      return { error: messages.error };
    },
  },
];
