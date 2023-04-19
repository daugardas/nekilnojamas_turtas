import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  LiveReload,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { MysqlError } from "mysql";
import { useState } from "react";
import { getF1 } from "~/Models/F1.server";
import { connection } from "~/entry.server";

type LoaderData = {
  f1Data: Awaited<ReturnType<typeof getF1>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { f1Data: await getF1() };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const objekto_id = form.get("objekto_id");
  const delete_query = `DELETE FROM nekilnojami_turtai WHERE objekto_id=${objekto_id}`;

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
            /* console.log(response); */
            resolve(response);
          }
        }
      );
    });

    console.log(await responseFromDB);
  } catch (err) {
    console.log(err);
  }
  return redirect("/F1");
};

export default function F1() {
  const { f1Data } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const onRowDeleteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    objekto_id: number
  ) => {
    let formData = new FormData();
    formData.append("objekto_id", objekto_id.toString());
    submit(formData, { method: "delete" });
  };

  return (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th>Objekto ID</th>
              <th>Plotas</th>
              <th>Pastatymo metai</th>
              <th>Adresas</th>
              <th>Verte</th>
              <th>Tipas</th>
              <th>Energinė klasė</th>
              <th>Savininko asmens kodas</th>
              <th>Savininko vardas</th>
              <th>Savininko pavardė</th>
              {/* <th>Ar buvo paimta paskola? Jei taip, koks jos numeris?</th>
              <th>Ar atliktas remontas? Jei taip, koks jo numersi?</th> */}
            </tr>
          </thead>
          <tbody>
            {f1Data.map((f1) => (
              <tr
                key={f1.objekto_id}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {f1.objekto_id}
                </td>
                <td className="whitespace-nowrap  font-medium">{f1.plotas}</td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(f1.pastatymo_metai).toLocaleDateString("lt-LT")}
                </td>
                <td className="whitespace-nowrap  font-medium">{f1.adresas}</td>
                <td className="whitespace-nowrap  font-medium">{f1.verte}</td>
                <td className="whitespace-nowrap  font-medium">{f1.tipas}</td>
                <td className="whitespace-nowrap  font-medium">
                  {f1.energine_klase}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {f1.asmens_kodas}
                </td>
                <td className="whitespace-nowrap  font-medium">{f1.vardas}</td>
                <td className="whitespace-nowrap  font-medium">{f1.pavarde}</td>

                <td className="">
                  <div className="flex">
                    <Link
                      to={`/F2/${f1.objekto_id}`}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Redaguoti
                    </Link>
                    <Form method="delete">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onRowDeleteButtonClick(e, f1.objekto_id);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Šalinti
                      </button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="">
          <Link
            to={`/F2/new`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Pridėti naują nekilnojamą turtą
          </Link>
        </div>
        <LiveReload />
      </div>
    </div>
  );
}
