import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { AsmuoModel } from "./AsmuoModel";
import { MokejimasModel } from "./MokejimasModel";
import { AsmuoMokejimaiN_turtasModel } from "./AsmuoMokejimaiN_turtasModel";

export async function getAsmenys(): Promise<AsmuoMokejimaiN_turtasModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT a.*, COUNT(m.fk_ASMUOasmens_kodas) AS mokejimu_kiekis,
        COUNT(n.fk_ASMUOasmens_kodas) AS nekilnojamu_turto_kiekis,
        Count(p.fk_ASMUOasmens_kodas) AS paskolu_kiekis
        FROM asmenys a 
        LEFT OUTER JOIN mokejimai m ON a.asmens_kodas = m.fk_ASMUOasmens_kodas 
        LEFT OUTER JOIN nekilnojami_turtai n ON a.asmens_kodas = n.fk_ASMUOasmens_kodas
        LEFT OUTER JOIN paskolos p ON a.asmens_kodas = p.fk_ASMUOasmens_kodas
        GROUP BY a.asmens_kodas
        ORDER BY a.vardas ASC, a.pavarde ASC, a.asmens_kodas ASC`,
      (err: MysqlError, result: AsmuoMokejimaiN_turtasModel[]) => {
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

export async function getAsmuoMokejimaiCount(
  asmens_kodas: string
): Promise<number> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT COUNT(*) FROM mokejimai WHERE fk_ASMUOasmens_kodas = ${asmens_kodas}`,
      (err: MysqlError, result: number[]) => {
        if (err) {
          console.log(err);
          resolve(0);
        } else {
          resolve(result[0]);
        }
      }
    );
  });
}

export async function getAsmuoMokejimai(
  asmens_kodas: string
): Promise<MokejimasModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM mokejimai WHERE fk_ASMUOasmens_kodas = ${asmens_kodas}`,
      (err: MysqlError, result: MokejimasModel[]) => {
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

export async function getAsmuo(
  asmens_kodas: string
): Promise<AsmuoModel | null> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM asmenys WHERE asmens_kodas = ${asmens_kodas} LIMIT 1`,
      (err: MysqlError, result: AsmuoModel[]) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else {
          resolve(result[0]);
        }
      }
    );
  });
}
