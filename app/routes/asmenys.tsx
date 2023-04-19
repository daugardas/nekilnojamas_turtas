import { DataFunctionArgs, LoaderFunction } from "@remix-run/node";
import { LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AsmuoModel } from "~/Models/AsmuoModel";
import AsmuoTR from "~/Components/AsmuoTR";
import { getAsmenys } from "~/Models/asmenys.server";
import { AsmuoMokejimaiN_turtasModel } from "~/Models/AsmuoMokejimaiN_turtasModel";

type LoaderData = {
  asmenys: Awaited<ReturnType<typeof getAsmenys>>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { asmenys: await getAsmenys() };
};

export default function Asmenys() {
  const { asmenys } = useLoaderData<LoaderData>();
  return (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center mt-64 flex-col">
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="">
                Asmens kodas
              </th>
              <th scope="col" className="">
                Vardas
              </th>
              <th scope="col" className="">
                Pavarde
              </th>
              <th scope="col" className="">
                Gimimo data
              </th>
              <th scope="col" className="">
                Telefono numeris
              </th>
              <th scope="col" className="">
                El. pastas
              </th>
              <th scope="col" className="">
                Deklaruota gyvenamoji vieta
              </th>
            </tr>
          </thead>
          <tbody>
            {asmenys.map((asmuo: AsmuoMokejimaiN_turtasModel) => (
              <AsmuoTR key={asmuo.asmens_kodas} asmuo={asmuo} />
            ))}
          </tbody>
        </table>
        <LiveReload />
      </div>
    </div>
  );
}
