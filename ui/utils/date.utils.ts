import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { customParseISODate } from "shared/helpers/cerfa/utils/dates";

export const formatDate = (date: string, dateFormat = "dd/MM/yyyy") => {
  return format(customParseISODate(date), dateFormat, {
    locale: fr,
  });
};
