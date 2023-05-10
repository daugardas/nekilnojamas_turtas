// export type AtaskaitaModel = {
//   asmens_kodas: number;
//   vardas: string;
//   pavarde: string;
//   objekto_id: number;
//   plotas: number;
//   verte: number;
//   nt_tipas: string;
//   suteikimo_data: string; // paskolos suteikimo data siam objektui
//   paskutinio_mokejimo_data: string; // paskolos paskutinio mokejimo data siam objektui  (jei nera, tai null)
//   suma: number;
//   anonimizuotas_el_pastas: string;
//   nekilnojamo_turto_kiekis: number;
//   vidutinis_plotas: number;
//   bendra_nekilnojamo_turto_verte: number;
//   anksciausia_paskola: string;
//   veliausias_mokejimas: string;
//   bendra_suma_mokejimai: number;
//   kiek_grupeje: number;
//   kiek_is_viso_grupese_nt: number;
// };

export type AtaskaitaModel = {
  asmens_kodas: number;
  vardas: string;
  pavarde: string;
  anonimizuotas_el_pastas: string;
  nekilnojamo_turto_kiekis: number;
  bendra_nekilnojamo_turto_verte: number;
  vidutinis_plotas: number;
  paskolu_kiekis: number;
  anksciausia_paskola: string;
  bendra_paskolu_suma: number;
  mokejimu_kiekis: number;
  veliausias_mokejimas: string;
  bendra_suma_mokejimai: number;
  nt_objekto_id: number;
  nt_plotas: number;
  nt_verte: number;
  nt_tipas: string;
  kiek_is_viso_grupese: number;
};
