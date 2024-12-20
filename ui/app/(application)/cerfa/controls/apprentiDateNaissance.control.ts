import { isEmpty } from "lodash-es";
import { CerfaControl, CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const apprentiDateNaissanceControl: CerfaControl[] = [
  {
    deps: ["apprenti.dateNaissance", "apprenti.nir"],
    process: async ({ values }: CerfaForm) => {
      const dateNaissance = values.apprenti.dateNaissance;
      let nir = values.apprenti.nir as string;

      if (isEmpty(dateNaissance) || isEmpty(nir)) {
        return {};
      }

      nir = nir.replace(/ /g, "");

      if (nir?.length < 3) {
        return {};
      }

      if (nir?.substring(1, 3) !== dateNaissance.substring(8, 10)) {
        return {
          error: "L'année de naissance indiquée ne correspond pas aux 2e et 3e chiffres du NIR",
        };
      }

      if (nir?.length < 5) {
        return {};
      }

      if (nir?.substring(3, 5) !== dateNaissance.substring(3, 5)) {
        return {
          error: "Le mois de naissance indiqué ne correspond pas aux 4e et 5e chiffres du NIR",
        };
      }

      return {};
    },
  },
];
