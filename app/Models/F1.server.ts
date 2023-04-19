import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { F1Model } from "./F1Model";

export async function getF1(): Promise<F1Model[]> {
  return new Promise((resolve) => {
    // const queryString = `
    // SELECT
    // nekilnojami_turtai.objekto_id,
    // nekilnojami_turtai.plotas,
    // nekilnojami_turtai.pastatymo_metai,
    // nekilnojami_turtai.adresas,
    // nekilnojamo_turto_tipai.name as tipas,
    // energetines_klases.name as energine_klase,
    // asmenys.vardas,
    // asmenys.pavarde,
    // CASE WHEN p.numeris IS NULL THEN 'Nėra paskolos' ELSE p.numeris END AS paskola,
    // CASE WHEN remontai.projekto_nr IS NULL THEN 'Nėra remonto' ELSE remontai.projekto_nr END AS remontasAtliktas
    // FROM nekilnojami_turtai
    // JOIN nekilnojamo_turto_tipai ON nekilnojami_turtai.tipas = nekilnojamo_turto_tipai.id_NEKILNOJAMO_TURTO_TIPAS
    // JOIN energetines_klases ON nekilnojami_turtai.energine_klase = energetines_klases.id_ENERGETINE_KLASE
    // JOIN asmenys ON nekilnojami_turtai.fk_ASMUOasmens_kodas = asmenys.asmens_kodas
    // JOIN pirkimo_pardavimo_sutartys AS pps ON nekilnojami_turtai.objekto_id = pps.fk_NEKILNOJAMAS_TURTASobjekto_id
    // JOIN paskolos AS p ON pps.sutarties_nr = p.fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr
    // JOIN remontai ON nekilnojami_turtai.objekto_id = remontai.fk_NEKILNOJAMAS_TURTASobjekto_id
    // `;
    const queryString = `
    SELECT 
    nekilnojami_turtai.objekto_id, 
    nekilnojami_turtai.plotas, 
    nekilnojami_turtai.pastatymo_metai, 
    nekilnojami_turtai.adresas, 
    nekilnojami_turtai.verte,
    nekilnojamo_turto_tipai.name as tipas, 
    energetines_klases.name as energine_klase,
    asmenys.asmens_kodas,
    asmenys.vardas,
    asmenys.pavarde
    FROM nekilnojami_turtai
    JOIN nekilnojamo_turto_tipai ON nekilnojami_turtai.tipas = nekilnojamo_turto_tipai.id_NEKILNOJAMO_TURTO_TIPAS
    JOIN energetines_klases ON nekilnojami_turtai.energine_klase = energetines_klases.id_ENERGETINE_KLASE
    JOIN asmenys ON nekilnojami_turtai.fk_ASMUOasmens_kodas = asmenys.asmens_kodas
    ORDER BY nekilnojami_turtai.objekto_id ASC
    `;
    const stringWithoutNewLines = queryString.replace(/(\r\n|\n|\r)/gm, "");
    connection.query(
      stringWithoutNewLines,
      (err: MysqlError, result: F1Model[]) => {
        if (err) {
          console.log(err);
          resolve([]);
        } else {
          resolve(result);
        }
      }
    );
  });
}
