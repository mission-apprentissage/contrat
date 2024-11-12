import { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";

import { PAGES } from "../breadcrumb/Breadcrumb";

interface GetNavigationItemsProps {
  pathname: string;
}

export const getNavigationItems = ({ pathname }: GetNavigationItemsProps): MainNavigationProps.Item[] => {
  const navigation: MainNavigationProps.Item[] = [
    {
      isActive: pathname === PAGES.homepage().path,
      text: "Accueil",
      linkProps: {
        href: PAGES.homepage().path,
      },
    },
    {
      isActive: pathname === PAGES.cerfa().path,
      text: PAGES.cerfa().title,
      linkProps: {
        href: PAGES.cerfa().path,
      },
    },
  ];

  return navigation.map((item) => {
    const { menuLinks } = item;

    const menuLinkWithActive = menuLinks?.map((link) => ({ ...link, isActive: link.linkProps.href === pathname }));
    const isActive = pathname === item.linkProps?.href || menuLinkWithActive?.some((link) => link.isActive);

    return { ...item, isActive, menuLinks };
  }) as MainNavigationProps.Item[];
};
