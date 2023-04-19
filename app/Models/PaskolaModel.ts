export type PaskolaModel = {
  numeris: number;
  suteikianti_imone: string;
  suma: number;
  palukanos: number;
  suteikimo_data: string;
  paskutinio_mokejimo_data?: string;
  busena: number;
  fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr?: number;
  fk_ASMUOasmens_kodas: number;
};

export type PaskolosBusena = {
  busenos_id: number;
  busena: string;
};