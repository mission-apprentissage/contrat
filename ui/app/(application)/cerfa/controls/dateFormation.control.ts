import { addMonths, differenceInMonths, isAfter, isBefore, subMonths } from "date-fns";
import { CerfaControl } from "shared/helpers/cerfa/types/cerfa.types";
import { customParseISODate } from "shared/helpers/cerfa/utils/dates";
export const dateFormationControl: CerfaControl[] = [
  {
    deps: ["formation.dateDebutFormation"],
    process: ({ values }) => {
      const { dateDebutFormation } = values.formation;
      const { dateDebutFormationPratique, dateDebutContrat } = values.contrat;

      if (!dateDebutFormation) return {};
      const dateDebutFormationDate = customParseISODate(dateDebutFormation);

      if (dateDebutFormationPratique) {
        const dateDebutFormationPratiqueDate = customParseISODate(dateDebutFormationPratique);

        if (isBefore(dateDebutFormationDate, subMonths(dateDebutFormationPratiqueDate, 3)))
          return {
            error:
              "La date de début de formation théorique ne peut être antérieure à 3 mois avant la date de début de formation pratique",
          };
      }

      if (dateDebutContrat) {
        const dateDebutContratDate = customParseISODate(dateDebutContrat);

        if (
          isBefore(dateDebutFormationDate, subMonths(dateDebutContratDate, 3)) ||
          isAfter(dateDebutFormationDate, addMonths(dateDebutContratDate, 3))
        )
          return {
            error:
              "La date de début de formation théorique ne peut être antérieure à 3 mois avant la date de début d'exécution du contrat et ne peut être postérieure à 3 mois après la date de début d'exécution du contrat",
          };
      }
    },
  },
  {
    deps: ["formation.dateDebutFormation", "formation.dateFinFormation"],
    process: ({ values }) => {
      const {
        formation: { dateDebutFormation, dateFinFormation },
      } = values;
      if (!dateDebutFormation || !dateFinFormation) return;
      const dateDebutFormationDate = customParseISODate(dateDebutFormation);
      const dateFinFormationDate = customParseISODate(dateFinFormation);

      if (isAfter(dateDebutFormationDate, dateFinFormationDate)) {
        return {
          error: "La date de début de formation théorique ne peut pas être postérieure à la date de fin de formation",
        };
      }

      const dureeContrat = differenceInMonths(dateFinFormationDate, dateDebutFormationDate);

      if (dureeContrat < 6) {
        return {
          error: "La durée de formation ne peut pas être inférieure à 6 mois",
        };
      }

      if (dureeContrat > 48) {
        return {
          error: "La durée de formation ne peut pas être supérieure à 4 ans",
        };
      }
    },
  },
  {
    deps: ["formation.dateFinFormation"],
    process: ({ values }) => {
      const {
        contrat: { dateDebutContrat, dateFinContrat, dateSignature },
        formation: { dateFinFormation },
      } = values;
      if (!dateFinFormation) return {};
      const dateFinFormationDate = customParseISODate(dateFinFormation);

      if (dateDebutContrat) {
        const dateDebutContratDate = customParseISODate(dateDebutContrat);

        if (isBefore(dateFinFormationDate, dateDebutContratDate)) {
          return {
            error: "La date ne peut être antérieure à la date de début d'exécution du contrat",
          };
        }
      }

      if (dateFinContrat) {
        const dateFinContratDate = customParseISODate(dateFinContrat);

        if (isAfter(dateFinFormationDate, dateFinContratDate)) {
          return {
            error: "La date ne peut être postérieure à la date de fin de contrat",
          };
        }
      }

      if (dateSignature) {
        const dateSignatureDate = customParseISODate(dateSignature);

        if (isBefore(dateFinFormationDate, dateSignatureDate)) {
          return {
            error: "La date ne peut être antérieure à la date de conclusion du contrat",
          };
        }
      }
    },
  },
  {
    deps: ["formation.dureeFormation"],
    process: ({ values }) => {
      const {
        formation: { dureeFormation },
      } = values;

      if (dureeFormation > 9999) {
        return {
          error: "La durée de la formation ne peut excéder 9999",
        };
      }
    },
  },
];
