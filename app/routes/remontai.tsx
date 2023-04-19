import { LoaderFunction } from "@remix-run/node";
import { Link, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { getPirkimoPardavimoSutartys } from "~/Models/pirkimo-pardavimo-sutartys.server";
import { getRemontai } from "~/Models/remontai.server";

type LoaderData = {
  remontai: Awaited<ReturnType<typeof getRemontai>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { remontai: await getRemontai() };
};

export default function PirkimoPardavimoSutartys() {
  const { remontai } = useLoaderData<LoaderData>();
  return remontai.length > 0 ? (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Projekto nr.
              </th>
              <th scope="col" className="">
                Pradžios data
              </th>
              <th scope="col" className="">
                Pabaigos data
              </th>
              <th scope="col" className="">
                Kaina
              </th>
              <th scope="col" className="">
                Aprašymas
              </th>
              <th scope="col" className="">
                Būsena
              </th>
              <th scope="col" className="">
                Nekilnojamo turto objekto nr., kuris remontuojamas
              </th>
            </tr>
          </thead>
          <tbody>
            {remontai.map((remontas) => (
              <tr
                key={remontas.projekto_nr}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {remontas.projekto_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(remontas.pradzia).toLocaleDateString("lt-LT")}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(remontas.pabaiga).toLocaleDateString("lt-LT")}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {remontas.kaina}
                </td>
                <td
                  className="whitespace-normal  font-medium"
                  style={{ wordWrap: "break-word" }}
                >
                  {remontas.aprasymas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {remontas.busena}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {remontas.fk_NEKILNOJAMAS_TURTASobjekto_id}
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
    <div>Nėra remontų.</div>
  );
}
