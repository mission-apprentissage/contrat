export const DIPLOMES = [
  {
    name: "Aucun diplôme ni titre",
    options: [
      {
        label: "25 - Diplôme national du Brevet",
        value: "25",
      },
      {
        label: "26 - Certificat de formation générale",
        value: "26",
      },
      {
        label: "13 - Aucun diplôme ni titre professionnel",
        value: "13",
      },
    ],
  },
  {
    name: "Diplôme ou titre de niveau CAP/BEP",
    options: [
      {
        label: "33 - CAP",
        value: "33",
      },
      {
        label: "34 - BEP",
        value: "34",
      },
      {
        label: "35 - Mention complémentaire",
        value: "35",
      },
      {
        label: "38 - Autre diplôme ou titre de niveau CAP/BEP",
        value: "38",
      },
    ],
  },
  {
    name: "Diplôme ou titre de niveau bac",
    options: [
      {
        label: "41 - Baccalauréat professionnel",
        value: "41",
      },
      {
        label: "42 - Baccalauréat général",
        value: "42",
      },
      {
        label: "43 - Baccalauréat technologique",
        value: "43",
      },
      {
        label: "49 - Autre diplôme ou titre de niveau bac",
        value: "49",
      },
    ],
  },
  {
    name: "Diplôme ou titre de niveau bac +2",
    options: [
      {
        label: "54 - Brevet de Technicien Supérieur",
        value: "54",
      },
      {
        label: "55 - Diplôme Universitaire de technologie",
        value: "55",
      },
      {
        label: "58 - Autre diplôme ou titre de niveau bac+2",
        value: "58",
      },
    ],
  },
  {
    name: "Diplôme ou titre de niveau bac +3 et 4",
    options: [
      {
        label: "61 - 1 ère année de Master",
        value: "61",
      },
      {
        label: "62 - Licence professionnelle",
        value: "62",
      },
      {
        label: "63 - Licence générale",
        value: "63",
      },
      {
        label: "69 - Autre diplôme ou titre de niveau bac +3 ou 4",
        value: "69",
      },
    ],
  },
  {
    name: "Diplôme ou titre de niveau bac +5 et plus",
    options: [
      {
        label: "80 - Doctorat",
        value: "80",
      },
      {
        label: "71 - Master professionnel/DESS",
        value: "71",
      },
      {
        label: "72 - Master recherche/DEA",
        value: "72",
      },
      {
        label: "73 - Master indifférencié",
        value: "73",
      },
      {
        label: "74 - Diplôme d'ingénieur, diplôme d'école de commerce",
        value: "74",
      },
      {
        label: "79 - Autre diplôme ou titre de niveau bac+5 ou plus",
        value: "79",
      },
    ],
  },
];

export const NIVEAUX_DIPLOMES = [
  { value: "0", label: "0 - Aucun diplôme ou titre" },
  { value: "3", label: "3 - CAP, BEP " },
  { value: "4", label: "4 - Baccalauréat " },
  { value: "5", label: "5 - DEUG, BTS, DUT, DEUST " },
  { value: "6", label: "6 - Licence, licence professionnelle, BUT, Maîtrise " },
  {
    value: "7",
    label: "7 - Master, diplôme d'études approfondies, diplôme d'études supérieures spécialisées, diplôme d'ingénieur",
  },
  { value: "8", label: "8 - Doctorat, habilitation à diriger des recherches " },
];

export const codeDiplomeStartToDiplome: Record<string, string> = {
  "010": "35",
  "013": "35",
  "100": "80",

  "135": "71",
  "140": "79",
  "146": "79",
  "155": "71",
  "160": "79",
  "165": "74",
  "170": "74",
  "16A": "79",
  "16C": "79",
  "16N": "79",
  "16Q": "79",
  "16R": "79",
  "16X": "79",

  "200": "63",
  "201": "63",
  "205": "63",
  "230": "69",
  "236": "69",
  "241": "69",
  "246": "69",
  "250": "62",
  "251": "64",
  "255": "69",
  "260": "69",
  "264": "69",
  "265": "69",
  "26A": "69",
  "26C": "69",
  "26M": "69",
  "26N": "69",
  "26Q": "69",
  "26R": "69",
  "26S": "69",
  "26T": "69",
  "26U": "69",
  "26X": "69",

  "320": "54",
  "321": "58",
  "322": "58",
  "323": "54",
  "336": "58",
  "346": "58",
  "350": "55",
  "355": "58",
  "360": "58",
  "363": "58",
  "364": "58",
  "36C": "58",
  "36E": "58",
  "36M": "58",
  "36N": "58",
  "36Q": "58",
  "36R": "58",
  "36S": "58",
  "36T": "58",
  "36U": "58",
  "36X": "58",

  "400": "41",
  "401": "49",
  "403": "41",
  "420": "49",
  "430": "43",
  "433": "43",
  "446": "49",
  "450": "49",
  "453": "49",
  "460": "49",
  "463": "49",
  "464": "49",
  "46A": "49",
  "46C": "49",
  "46E": "49",
  "46M": "49",
  "46N": "49",
  "46R": "49",
  "46S": "49",
  "46T": "49",
  "46X": "49",

  "500": "33",
  "503": "33",
  "510": "34",
  "553": "38",
  "560": "38",
  "563": "38",
  "564": "38",
  "56C": "38",
  "56E": "38",
  "56J": "38",
  "56M": "38",
  "56R": "38",
  "56T": "38",
  "56X": "38",

  "671": "25",
  "672": "26",
};

export const getTypeDiplomeFromCodeDiplome = (codeDiplome: string): string | undefined => {
  if (codeDiplome?.length < 3) {
    return;
  }

  const codeDiplomePrefix = codeDiplome?.slice(0, 3);
  return codeDiplomeStartToDiplome?.[codeDiplomePrefix];
};
