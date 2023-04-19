export type NekilnojamasTurtasModel = {
  objekto_id: number;
  plotas: number;
  pastatymo_metai: string;
  renovacijos_metai?: string;
  adresas: string;
  verte: number;
  tipas: number;
  energine_klase: number;
  fk_ASMUOasmens_kodas: number;
};

export type NekilnojamoTurtoTipas = {
  tipoID: number;
  pavadinimas: string;
};

export type NekilnojamoTurtoEnergetineKlase = {
  energinesKlasesID: number;
  pavadinimas: string;
};

export const NekilnojamoTurtoTipai: string[] = [
  "butas",
  "namas",
  "kambarys",
  "kotedzas",
  "ofisas",
  "kita",
];

export const NekilnojamoTurtoEnergetinesKlases: string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
];
