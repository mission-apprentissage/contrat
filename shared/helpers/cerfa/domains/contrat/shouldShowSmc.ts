import { differenceInYears } from "date-fns";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import { customParseISODate } from "../../utils/dates";

export const shouldShowSmc = ({ values }: CerfaForm) => {
  if (!values.contrat.dateFinContrat || !values.apprenti.dateNaissance) return false;
  const dateFinContrat = customParseISODate(values.contrat.dateFinContrat);
  const dateNaissance = customParseISODate(values.apprenti.dateNaissance);

  return differenceInYears(dateFinContrat, dateNaissance) >= 21;
};
