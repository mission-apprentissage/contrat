import { Header as DSFRHeader } from "@codegouvfr/react-dsfr/Header";
import { usePathname } from "next/navigation";

import { getNavigationItems } from "./header.utils";

export const Header = () => {
  const pathname = usePathname();

  const navigation = getNavigationItems({ pathname });

  return (
    <DSFRHeader
      brandTop={
        <>
          République
          <br />
          Française
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - Contrat",
      }}
      quickAccessItems={[]}
      serviceTitle="CERFA Contrat d'apprentissage"
      navigation={navigation}
    />
  );
};
