import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { RemontasModel } from "./RemontasModel";

export async function getRemontai(): Promise<RemontasModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM remontai ORDER BY projekto_nr ASC`,
      (err: MysqlError, result: RemontasModel[]) => {
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
