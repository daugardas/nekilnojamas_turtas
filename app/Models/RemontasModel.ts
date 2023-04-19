export type RemontasModel = {
  projekto_nr: number;
  pradzia: Date;
  pabaiga: Date;
  kaina: number;
  aprasymas: string;
  busena: number;
  fk_NEKILNOJAMAS_TURTASobjekto_id: number;
  fk_ASMUOasmens_kodas: number;
};
