import { ReadonlyURLSearchParams } from "next/navigation";

export const EVENTS = {
  DOWNLOAD_CERFA: "Télécharger Cerfa",
  COMMENCER_CERFA: "click_commencer",
} as const;

const SOURCES = {
  TABLEAU_DE_BORD: "tdb",
} as const;

export const getTrackingPropsFromParams = (queryParams: ReadonlyURLSearchParams) => {
  const props: Record<string, string | null> = {};

  if (queryParams.get("utm_source") === SOURCES.TABLEAU_DE_BORD && queryParams.get("utm_content")) {
    props.organisme_id = queryParams.get("utm_content");
  }

  return props;
};
