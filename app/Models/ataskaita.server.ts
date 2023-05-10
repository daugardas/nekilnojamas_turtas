import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { AtaskaitaModel } from "./ataskaitaModel";
import { sendQuery } from "~/Services/queryDB";

export interface AtaskaitaParams {
  pasirinkti_nt_tipai: number[];
  pasirinktos_paskolos_busenos: number[];
  min_mokejimu_suma: number;
  min_nt_kiekis: number;
  min_nt_plotas: number;
}

export async function getAtaskaita(
  data: AtaskaitaParams
): Promise<AtaskaitaModel[]> {
  return new Promise(async (resolve) => {
    const queryString = `
SELECT 
    sub.*, 
    COUNT(*) OVER() AS kiek_is_viso_grupese 
FROM 
    ( 
    SELECT 
        A.asmens_kodas, 
        A.vardas, 
        A.pavarde, 
        CONCAT( 
            LEFT(A.el_pastas, 3), 
            '***', 
            SUBSTRING( 
                A.el_pastas, 
                LOCATE('@', A.el_pastas) 
            ) 
        ) AS anonimizuotas_el_pastas, 
        (SELECT COUNT(*)
         FROM nekilnojami_turtai NT
         INNER JOIN nekilnojamo_turto_tipai NT_T ON NT.tipas = NT_T.id_NEKILNOJAMO_TURTO_TIPAS
         WHERE NT.fk_ASMUOasmens_kodas = A.asmens_kodas
         AND NT_T.id_NEKILNOJAMO_TURTO_TIPAS IN (${
           data.pasirinkti_nt_tipai.length > 0
             ? data.pasirinkti_nt_tipai.toString()
             : 0
         })
         AND NT.plotas >= ${data.min_nt_plotas.toString()}) AS nekilnojamo_turto_kiekis,
    SUM(N.verte) AS bendra_nekilnojamo_turto_verte, 
    AVG(N.plotas) AS vidutinis_plotas, 
    P.paskolu_kiekis, 
    P.anksciausia_paskola, 
    P.bendra_paskolu_suma, 
    M.mokejimu_kiekis, 
    M.veliausias_mokejimas, 
    M.bendra_suma_mokejimai, 
    N.objekto_id AS nt_objekto_id, 
    N.plotas AS nt_plotas, 
    N.verte AS nt_verte, 
    T.name AS nt_tipas 
FROM 
    asmenys A 
LEFT JOIN nekilnojami_turtai N ON 
    A.asmens_kodas = N.fk_ASMUOasmens_kodas 
INNER JOIN nekilnojamo_turto_tipai T ON 
    N.tipas = T.id_NEKILNOJAMO_TURTO_TIPAS 
LEFT JOIN( 
    SELECT 
        fk_ASMUOasmens_kodas, 
        COUNT(numeris) AS paskolu_kiekis, 
        MIN(suteikimo_data) AS anksciausia_paskola, 
        SUM(suma) AS bendra_paskolu_suma 
    FROM 
        paskolos 
    WHERE 
        busena IN( 
        SELECT 
            id_PASKOLOS_BUSENA 
        FROM 
            paskolos_busenos 
        WHERE 
            id_PASKOLOS_BUSENA IN(${
              data.pasirinktos_paskolos_busenos.length > 0
                ? data.pasirinktos_paskolos_busenos.toString()
                : 0
            }) 
    ) 
    GROUP BY fk_ASMUOasmens_kodas
) P 
ON 
    A.asmens_kodas = P.fk_ASMUOasmens_kodas 
LEFT JOIN( 
    SELECT 
        fk_ASMUOasmens_kodas, 
        COUNT(israso_nr) AS mokejimu_kiekis, 
        MAX(israsymo_data) AS veliausias_mokejimas, 
        SUM(suma) AS bendra_suma_mokejimai 
    FROM 
        mokejimai
    GROUP BY fk_ASMUOasmens_kodas
) M 
ON 
    A.asmens_kodas = M.fk_ASMUOasmens_kodas 
WHERE 
    N.tipas IN( 
    SELECT 
        id_NEKILNOJAMO_TURTO_TIPAS 
    FROM 
        nekilnojamo_turto_tipai 
    WHERE 
        id_NEKILNOJAMO_TURTO_TIPAS IN(${
          data.pasirinkti_nt_tipai.length > 0
            ? data.pasirinkti_nt_tipai.toString()
            : 0
        }) 
) 
GROUP BY 
    nt_objekto_id 
HAVING 
    nekilnojamo_turto_kiekis >= ${data.min_nt_kiekis.toString()}  AND nt_plotas >= ${data.min_nt_plotas.toString()} AND COALESCE(bendra_suma_mokejimai, 0) >= ${data.min_mokejimu_suma.toString()}
) sub 

ORDER BY 
    sub.nekilnojamo_turto_kiekis 
DESC;
    `;
    try {
      const result = await sendQuery<AtaskaitaModel>(queryString);
      resolve(result);
    } catch (err) {
      console.log(err);
      resolve([]);
    }
  });
}
