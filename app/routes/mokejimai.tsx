import { LoaderFunction } from "@remix-run/node";
import { Link, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { getMokejimai } from "~/Models/mokejimai.server";

type LoaderData = {
  mokejimai: Awaited<ReturnType<typeof getMokejimai>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { mokejimai: await getMokejimai() };
};

export default function Mokejimai() {
  const { mokejimai } = useLoaderData<LoaderData>();
  return mokejimai.length > 0 ? (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Išrašo nr.
              </th>
              <th scope="col" className="">
                Išrašymo data
              </th>
              <th scope="col" className="">
                Suma
              </th>
              <th scope="col" className="">
                Sumokėjusio asmens kodas
              </th>
              <th scope="col" className="">
                Pirkimo-Pardavimo sutarties nr., kurios sumą apmokėjo
              </th>
              <th scope="col" className="">
                Paskolos nr., kurią apmokėjo
              </th>
            </tr>
          </thead>
          <tbody>
            {mokejimai.map((mokejimas) => (
              <tr
                key={mokejimas.israso_nr}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {mokejimas.israso_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(mokejimas.israsymo_data).toLocaleDateString(
                    "lt-LT"
                  )}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {mokejimas.suma}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {mokejimas.fk_ASMUOasmens_kodas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {mokejimas.fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {mokejimas.fk_PASKOLAnumeris}
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
  ) : (
    <div>Nėra mokėjimų.</div>
  );
}
