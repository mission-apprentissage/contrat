"use client";

import { startReactDsfr } from "@codegouvfr/react-dsfr/next-appdir";
import Link from "next/link";

declare module "@codegouvfr/react-dsfr/next-appdir" {
  interface RegisterLink {
    Link: typeof Link;
  }
}

startReactDsfr({ defaultColorScheme: "light", Link });

export function StartDsfr() {
  //Yes, leave null here.
  return null;
}
