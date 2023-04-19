import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import {
  NekilnojamasTurtasModel,
  NekilnojamoTurtoEnergetineKlase,
  NekilnojamoTurtoTipas,
} from "./NekilnojamasTurtasModel";

export async function getNekilnojamiTurtai(): Promise<
  NekilnojamasTurtasModel[]
> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM nekilnojami_turtai ORDER BY objekto_id ASC`,
      (err: MysqlError, result: NekilnojamasTurtasModel[]) => {
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

export async function getNekilnojamasTurtas(
  objekto_id: string
): Promise<NekilnojamasTurtasModel> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM nekilnojami_turtai WHERE objekto_id = ${objekto_id}`,
      (err: MysqlError, result: NekilnojamasTurtasModel[]) => {
        if (err) {
          console.log(err);
          resolve({} as NekilnojamasTurtasModel);
        } else {
          resolve(result[0]);
        }
      }
    );
  });
}

export async function getNekilnojamasTurtasTipai(): Promise<
  NekilnojamoTurtoTipas[]
> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT id_NEKILNOJAMO_TURTO_TIPAS as tipoID, name as pavadinimas FROM nekilnojamo_turto_tipai ORDER BY id_NEKILNOJAMO_TURTO_TIPAS ASC`,
      (err: MysqlError, result: NekilnojamoTurtoTipas[]) => {
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

export async function getNekilnojamasTurtasEnergetinesKlases(): Promise<
  NekilnojamoTurtoEnergetineKlase[]
> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT id_ENERGETINE_KLASE as energinesKlasesID, name as pavadinimas FROM energetines_klases ORDER BY energinesKlasesID ASC`,
      (err: MysqlError, result: NekilnojamoTurtoEnergetineKlase[]) => {
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
