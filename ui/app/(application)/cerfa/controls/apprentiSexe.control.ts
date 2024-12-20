import { isEmpty } from "lodash-es";
import { CerfaControl } from "shared/helpers/cerfa/types/cerfa.types";

export const apprentiSexe: CerfaControl[] = [
  {
    deps: ["apprenti.nir", "apprenti.sexe"],
    process: async ({ values }) => {
      const sexe = values.apprenti.sexe;
      const nir = values.apprenti.nir as string;

      if (isEmpty(sexe) || isEmpty(nir)) {
        return {};
      }

      if (sexe === "M" && !nir.startsWith("1")) {
        return {
          error:
            "Le sexe renseigné ne correspond pas au 1er chiffre du NIR (il doit commencer par 1 pour le sexe Masculin)",
        };
      }

      if (sexe === "F" && !nir.startsWith("2")) {
        return {
          error:
            "Le sexe renseigné ne correspond pas au 1er chiffre du NIR (il doit commencer par 2 pour le sexe Féminin)",
        };
      }

      return {};
    },
  },
];
