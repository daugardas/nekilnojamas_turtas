import { ActionFunction } from "@remix-run/node";
import { MysqlError } from "mysql";
import { connection } from "~/entry.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const israso_nr = form.get("israso_nr");
  const israsymo_data = form.get("israsymo_data");
  const fk_ASMUOasmens_kodas = form.get("asmens_kodas");
  const fk_PASKOLAnumeris = form.get("fk_PASKOLAnumeris");

  const insert_query = `
    INSERT INTO mokejimai (israso_nr, israsymo_data, fk_ASMUOasmens_kodas, fk_PASKOLAnumeris)
    VALUES (${israso_nr}, DATE_FORMAT('${israsymo_data}', '%Y-%m-%d'), ${fk_ASMUOasmens_kodas}, ${fk_PASKOLAnumeris})
    `;

  try {
    const responseFromDB = new Promise((resolve, reject) => {
      const stringWithoutNewLines = insert_query.replace(/(\r\n|\n|\r)/gm, "");
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
