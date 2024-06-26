import { Header as DSFRHeader, HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { useAuth } from "context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { apiGet } from "utils/api.utils";

import { PAGES } from "../breadcrumb/Breadcrumb";
import { getNavigationItems } from "./header.utils";

export const Header = () => {
  const { user, setUser } = useAuth();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await apiGet("/auth/logout", {});
    setUser();
    push(PAGES.homepage().path);
  };

  const navigation = getNavigationItems({ user, pathname });

  const _loggedOut: HeaderProps.QuickAccessItem[] = [
    {
      iconId: "fr-icon-lock-line",
      linkProps: {
        href: PAGES.connexion().path,
      },
      text: "Se connecter",
    },
  ];

  const _loggedIn: HeaderProps.QuickAccessItem[] = [
    {
      linkProps: {
        href: PAGES.compteProfil().path,
      },
      iconId: "fr-icon-account-line",
      text: "Mon compte",
    },
    {
      buttonProps: {
        onClick: handleLogout,
      },
      text: "Se deconnecter",
      iconId: "fr-icon-logout-box-r-line",
    },
  ];

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
