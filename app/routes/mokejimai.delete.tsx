import { ActionFunction, redirect } from "@remix-run/node";
import { MysqlError } from "mysql";
import { connection } from "~/entry.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const israso_nr = form.get("israso_nr");
  const delete_query = `DELETE FROM mokejimai WHERE israso_nr=${israso_nr}`;

  let responseFromDB: Promise<any>;
  try {
    responseFromDB = new Promise((resolve, reject) => {
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
  } finally {
    connection.end();
    /* return redirect("/mokejimai"); */
  }
  return redirect("/F1");
  /* const referer = request.headers.get("Referer");

  if (!referer) {
    return redirect("/mokejimai");
  }
  return redirect(referer); */
};
