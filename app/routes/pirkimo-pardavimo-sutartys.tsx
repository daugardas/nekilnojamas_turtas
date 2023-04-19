import { LoaderFunction } from "@remix-run/node";
import { Link, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { getPirkimoPardavimoSutartys } from "~/Models/pirkimo-pardavimo-sutartys.server";

type LoaderData = {
  sutartys: Awaited<ReturnType<typeof getPirkimoPardavimoSutartys>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { sutartys: await getPirkimoPardavimoSutartys() };
};

export default function PirkimoPardavimoSutartys() {
  const { sutartys } = useLoaderData<LoaderData>();
  return sutartys.length > 0 ? (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Pirkimo-Pardavimo sutarties nr.
              </th>
              <th scope="col" className="">
                Data
              </th>
              <th scope="col" className="">
                Suma
              </th>
              <th scope="col" className="">
                Pardavėjo asmens kodas
              </th>
              <th scope="col" className="">
                Pirkėjo asmens kodas
              </th>
              <th scope="col" className="">
                Pardavėjo tel. nr.
              </th>
              <th scope="col" className="">
                Pirkėjo tel. nr.
              </th>
              <th scope="col" className="">
                Nekilnojamo turti objekto nr., kuris parduodamas
              </th>
            </tr>
          </thead>
          <tbody>
            {sutartys.map((sutartis) => (
              <tr
                key={sutartis.sutarties_nr}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.sutarties_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(sutartis.sudarymo_data).toLocaleDateString("lt-LT")}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.mokejimo_suma}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.pardavejo_asmens_kodas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.pirkejo_asmens_kodas}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.pardavejo_tel_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.pirkejo_tel_nr}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {sutartis.fk_NEKILNOJAMAS_TURTASobjekto_id}
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
    <div>Nėra pirkomo-pardavimo sutartčių.</div>
  );
}
