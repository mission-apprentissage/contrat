// import "../globals.css";
import "react-notion-x/src/styles.css";

import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import { AuthContextProvider } from "context/AuthContext";
import { Metadata } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { IUserPublic } from "shared/models/user.model";
import { defaultColorScheme } from "theme/defaultColorScheme";
import { apiGet } from "utils/api.utils";

import { StartDsfr } from "../StartDsfr";

async function getSession(): Promise<IUserPublic | undefined> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  try {
    const session: IUserPublic = await apiGet(`/auth/session`, {});
    return session;
  } catch (error) {
    console.log(error);
    return;
  }
}

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  title: "Formulaire contrat d'apprentissage",
  description:
    "Formulaire guidé : nombreux contrôles pour éviter les erreurs, listes déroulantes et complétion automatique pour faciliter la saisie, calcul de rémunération…",
  keywords: ["contrat", "apprentissage", "formulaire"],
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  const lang = "fr";
  return (
    <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
      <head>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            //"Marianne-Light",
            //"Marianne-Light_Italic",
            "Marianne-Regular",
            //"Marianne-Regular_Italic",
            "Marianne-Medium",
            //"Marianne-Medium_Italic",
            "Marianne-Bold",
            //"Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
        />
      </head>
      <body>
        <AuthContextProvider initialUser={session}>
          <DsfrProvider lang={lang}>{children}</DsfrProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
