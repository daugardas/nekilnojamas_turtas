import { ActionFunction } from "@remix-run/node";
import { MysqlError } from "mysql";
import { connection } from "~/entry.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const suteikianti_imone = form.get("suteikianti_imone");
  const suma = form.get("suma");
  const palukanos = form.get("palukanos");
  const suteikimo_data = form.get("suteikimo_data");
  const paskutinio_mokejimo_data = form.get("paskutinio_mokejimo_data");
  const busena = form.get("busena");
  const fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr = form.get(
    "fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr"
  );
  const fk_ASMUOasmens_kodas = form.get("fk_ASMUOasmens_kodas");
  const insert_query = `
    INSERT INTO paskolos
    (suteikianti_imone, suma, palukanos, suteikimo_data, paskutinio_mokejimo_data, busena, fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr, fk_ASMUOasmens_kodas)
    VALUES (${suteikianti_imone}, ${suma}, ${palukanos}, DATE_FORMAT('${suteikimo_data}', '%Y-%m-%d'), DATE_FORMAT('${paskutinio_mokejimo_data}', '%Y-%m-%d'), ${busena}, ${fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr}, ${fk_ASMUOasmens_kodas})`;

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
