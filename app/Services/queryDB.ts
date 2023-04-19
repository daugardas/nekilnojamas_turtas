import { MysqlError } from "mysql";
import { connection } from "~/entry.server";

export const sendQuery = async <T>(query: string): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const stringWithoutNewLines = query.replace(/(\r\n|\n|\r)/gm, "");
    connection.query(
      stringWithoutNewLines,
      (err: MysqlError, response: T[]) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(response);
          resolve(response);
        }
      }
    );
  });
