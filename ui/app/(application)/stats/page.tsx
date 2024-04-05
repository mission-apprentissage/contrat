import { Metadata } from "next";

import Statistics from "./components/Statistics";

export const metadata: Metadata = {
  title: "Page statistiques du générateur de contrat d'apprentissage",
  description: "Statistiques d'usage du générateur de CERFA contrat d'apprentissage (visitorat, téléchargements).",
};

const StatsPage = () => {
  return <Statistics />;
};

export default StatsPage;
