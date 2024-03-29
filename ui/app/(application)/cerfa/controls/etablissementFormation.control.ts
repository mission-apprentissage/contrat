import { shouldAskEtablissementFormation } from "shared/helpers/cerfa/domains/formation/shouldAskEtablissementFormation";
import { CerfaControl } from "shared/helpers/cerfa/types/cerfa.types";

import { createCopyOrRestoreRule } from "./utils/createCopyOrRestoreRule";
import { createCopyRules } from "./utils/createCopyRules";

export const etablissementFormationControl: CerfaControl[] = [
  createCopyOrRestoreRule({
    deps: ["etablissementFormation.memeResponsable"],
    mapping: {
      "organismeFormation.denomination": "etablissementFormation.denomination",
      "organismeFormation.siret": "etablissementFormation.siret",
      "organismeFormation.uaiCfa": "etablissementFormation.uaiCfa",
      "organismeFormation.adresse.numero": "etablissementFormation.adresse.numero",
      "organismeFormation.adresse.voie": "etablissementFormation.adresse.voie",
      "organismeFormation.adresse.complement": "etablissementFormation.adresse.complement",
      "organismeFormation.adresse.codePostal": "etablissementFormation.adresse.codePostal",
      "organismeFormation.adresse.commune": "etablissementFormation.adresse.commune",
    },
    restoreIf: ({ values }) => shouldAskEtablissementFormation({ values }),
  }),
  ...createCopyRules({
    mapping: {
      "organismeFormation.denomination": "etablissementFormation.denomination",
      "organismeFormation.siret": "etablissementFormation.siret",
      "organismeFormation.uaiCfa": "etablissementFormation.uaiCfa",
      "organismeFormation.adresse.numero": "etablissementFormation.adresse.numero",
      "organismeFormation.adresse.voie": "etablissementFormation.adresse.voie",
      "organismeFormation.adresse.complement": "etablissementFormation.adresse.complement",
      "organismeFormation.adresse.codePostal": "etablissementFormation.adresse.codePostal",
      "organismeFormation.adresse.commune": "etablissementFormation.adresse.commune",
    },
    copyIf: ({ values }) => !shouldAskEtablissementFormation({ values }),
  }),
];
