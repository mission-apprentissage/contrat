import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldAskDateEffetAvenant = ({ values }: CerfaForm) => {
  return ["31", "32", "33", "34", "35", "36", "37"].includes(values.contrat.typeContratApp);
};
