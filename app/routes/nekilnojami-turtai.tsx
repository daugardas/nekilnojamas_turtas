import { LoaderFunction } from "@remix-run/node";
import { Link, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import {
  NekilnojamoTurtoEnergetinesKlases,
  NekilnojamoTurtoTipai,
} from "~/Models/NekilnojamasTurtasModel";
import { getNekilnojamiTurtai } from "~/Models/nekilnojami-turtai.server";

type LoaderData = {
  nekilnojamiTurtai: Awaited<ReturnType<typeof getNekilnojamiTurtai>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { nekilnojamiTurtai: await getNekilnojamiTurtai() };
};

export default function NekilnojamiTurtai() {
  const { nekilnojamiTurtai } = useLoaderData<LoaderData>();
  return (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Objekto ID
              </th>
              <th scope="col" className="">
                Plotas
              </th>
              <th scope="col" className="">
                Pastatymo metai
              </th>
              <th scope="col" className="">
                Renovacijos metai
              </th>
              <th scope="col" className="">
                Adresas
              </th>
              <th scope="col" className="">
                Vertė
              </th>
              <th scope="col" className="">
                Tipas
              </th>
              <th scope="col" className="">
                Energinė klasė
              </th>
              <th scope="col" className="">
                Savininko asmens kodas
              </th>
            </tr>
          </thead>
          <tbody>
            {nekilnojamiTurtai.map((turtas) => (
              <tr
                key={turtas.objekto_id}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {turtas.objekto_id}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {turtas.plotas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(turtas.pastatymo_metai).toLocaleDateString("lt-LT")}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(turtas.renovacijos_metai).toLocaleDateString(
                    "lt-LT"
                  )}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {turtas.adresas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {turtas.verte}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {NekilnojamoTurtoTipai[turtas.tipas - 1]}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {NekilnojamoTurtoEnergetinesKlases[turtas.energine_klase - 1]}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {turtas.fk_ASMUOasmens_kodas}
                </td>
                {/* <td className="">
                  <div className="flex">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                      Redaguoti
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                      Šalinti
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <LiveReload />
      </div>
    </div>
  );
}
