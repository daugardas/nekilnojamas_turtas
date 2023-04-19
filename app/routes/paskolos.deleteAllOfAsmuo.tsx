import { ActionFunction } from "@remix-run/node";
import { MysqlError } from "mysql";
import { connection } from "~/entry.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const asmens_kodas = form.get("asmens_kodas");
  const delete_query = `DELETE FROM paskolos WHERE fk_ASMUOasmens_kodas=${asmens_kodas}`;

  try {
    const responseFromDB = new Promise((resolve, reject) => {
      const stringWithoutNewLines = delete_query.replace(/(\r\n|\n|\r)/gm, "");
      connection.query(
        stringWithoutNewLines,
        (err: MysqlError, response: any) => {
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

    console.log(await responseFromDB);
  } catch (err) {
    console.log(err);
  }

  return null;
};
