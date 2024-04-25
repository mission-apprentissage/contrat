import { differenceInYears, parseISO } from "date-fns";

export const caclAgeAtDate = (dateNaissanceString: string, dateString: string) => {
  const dateNaissance = customParseISODate(dateNaissanceString);
  const dateObj = customParseISODate(dateString);

  // Note: differenceInYears already gives a whole number
  const years = differenceInYears(dateObj, dateNaissance);
  const age = years > 0 ? years : 0;

  return {
    age,
    exactAge: age, // since differenceInYears already returns a whole number
  };
};

export const customParseISODate = (str: string) => parseISO(str.split("/").reverse().join("-"));
