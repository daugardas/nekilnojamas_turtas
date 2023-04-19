import { MysqlError } from "mysql";
import { connection } from "~/entry.server";
import { MokejimasModel } from "./MokejimasModel";

export async function getMokejimai(): Promise<MokejimasModel[]> {
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM mokejimai ORDER BY israsymo_data ASC`,
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
