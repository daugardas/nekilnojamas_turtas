import { LoaderFunction } from "@remix-run/node";
import { Link, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { getPaskolos } from "~/Models/paskolos.server";

type LoaderData = {
  paskolos: Awaited<ReturnType<typeof getPaskolos>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { paskolos: await getPaskolos() };
};

export default function Paskolos() {
  const { paskolos } = useLoaderData<LoaderData>();
  return paskolos.length > 0 ? (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Paskolos nr.
              </th>
              <th scope="col" className="">
                Suteikianti įmonė
              </th>
              <th scope="col" className="">
                Suma
              </th>
              <th scope="col" className="">
                Palūkanos
              </th>
              <th scope="col" className="">
                Suteikimo data
              </th>
              <th scope="col" className="">
                Paskutinio mokėjimo data
              </th>
              <th scope="col" className="">
                Būsena
              </th>
              <th scope="col" className="">
                Pirkimo-Pardavimo sutarties nr., kurios sumą apmokėjo paskola
              </th>
              <th scope="col" className="">
                Paskolos gavėjo asmens kodas
              </th>
            </tr>
          </thead>
          <tbody>
            {paskolos.map((paskola) => (
              <tr
                key={paskola.numeris}
                className="border-b dark:border-neutral-500"
              >
                <td className="whitespace-nowrap  font-medium">
                  {paskola.numeris}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {paskola.suteikianti_imone}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {paskola.suma}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {paskola.palukanos}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {new Date(paskola.suteikimo_data).toLocaleDateString("lt-LT")}
                </td>
                {paskola.paskutinio_mokejimo_data ? (
                  <td className="whitespace-nowrap  font-medium">
                    {new Date(
                      paskola.paskutinio_mokejimo_data
                    ).toLocaleDateString("lt-LT")}
                  </td>
                ) : 'Nėra'}
                <td className="whitespace-nowrap  font-medium">
                  {paskola.busena}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {paskola.fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr
                    ? paskola.fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr
                    : "Nėra"}
                </td>
                <td className="whitespace-nowrap  font-medium">
                  {paskola.fk_ASMUOasmens_kodas}
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
    <div>Nėra paskolų</div>
  );
}
