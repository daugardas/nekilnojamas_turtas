import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { PaskolaModel, PaskolosBusena } from "./PaskolaModel";

export async function getPaskolos(): Promise<PaskolaModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM paskolos ORDER BY numeris ASC`,
      (err: MysqlError, result: PaskolaModel[]) => {
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

export async function getPaskolosOfAsmuo(
  asmens_kodas: number
): Promise<PaskolaModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM paskolos WHERE fk_ASMUOasmens_kodas = ${asmens_kodas}`,
      (err: MysqlError, result: PaskolaModel[]) => {
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

export async function getPaskolosBusenos(): Promise<PaskolosBusena[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT id_PASKOLOS_BUSENA AS busenos_id, name as busena FROM paskolos_busenos ORDER BY busenos_id ASC`,
      (err: MysqlError, result: PaskolosBusena[]) => {
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
