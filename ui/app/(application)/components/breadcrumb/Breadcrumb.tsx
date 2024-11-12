import { Breadcrumb as DSFRBreadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import React, { FC } from "react";

export const PAGES = {
  homepage: () => ({
    title: "Accueil",
    path: "/",
  }),
  mentionsLegales: () => ({
    title: "Mentions Légales",
    path: "https://cfas.apprentissage.beta.gouv.fr/mentions-legales",
  }),
  accessibilite: () => ({
    title: "Accessibilité",
    path: "/accessibilite",
  }),
  cgu: () => ({
    title: "Conditions Générales d'Utilisation",
    path: "https://cfas.apprentissage.beta.gouv.fr/cgu",
  }),
  politiqueConfidentialite: () => ({
    title: "Politique de Confidentialité",
    path: "https://cfas.apprentissage.beta.gouv.fr/politique-de-confidentialite",
  }),
  stats: () => ({
    title: "Statistiques",
    path: "/stats",
  }),
  cerfa: () => ({
    title: "Cerfa",
    path: "/cerfa",
  }),
};

export interface Page {
  title: string;
  path: string;
}

interface Props {
  pages: Page[];
}

const Breadcrumb: FC<Props> = ({ pages }) => {
  const currentPage = pages.pop();

  return (
    <DSFRBreadcrumb
      currentPageLabel={currentPage?.title}
      homeLinkProps={{
        href: PAGES.homepage().path,
      }}
      segments={pages.map((page) => ({
        label: page.title,
        linkProps: {
          href: page.path,
        },
      }))}
    />
  );
};

export default Breadcrumb;
