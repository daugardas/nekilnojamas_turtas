import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { PirkimoPardavimoSutartisModel } from "./PirkimoPardavimoSutartisModel";

export async function getPirkimoPardavimoSutartys(): Promise<PirkimoPardavimoSutartisModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM pirkimo_pardavimo_sutartys ORDER BY sudarymo_data ASC`,
      (err: MysqlError, result: PirkimoPardavimoSutartisModel[]) => {
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
