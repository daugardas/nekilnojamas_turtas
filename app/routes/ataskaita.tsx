import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, LiveReload, useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { AtaskaitaParams, getAtaskaita } from "~/Models/ataskaita.server";
import { AtaskaitaModel } from "~/Models/ataskaitaModel";

type LoaderData = {
  ataskaitaData: Awaited<ReturnType<typeof getAtaskaita>>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const butas = searchParams.get("butas") === "on";
  const namas = searchParams.get("namas") === "on";
  const kambarys = searchParams.get("kambarys") === "on";
  const kotedzas = searchParams.get("kotedzas") === "on";
  const ofisas = searchParams.get("ofisas") === "on";
  const kita = searchParams.get("kita") === "on";

  let data: AtaskaitaParams = {
    pasirinkti_nt_tipai: [],
    pasirinktos_paskolos_busenos: [],
    min_mokejimu_suma: searchParams.get("minMokejimuSuma")
      ? Number(searchParams.get("minMokejimuSuma"))
      : 0,
    min_nt_kiekis: searchParams.get("minNT")
      ? Number(searchParams.get("minNT"))
      : 0,
    min_nt_plotas: searchParams.get("minPlotas")
      ? Number(searchParams.get("minPlotas"))
      : 0,
  };
  if (butas) data.pasirinkti_nt_tipai.push(1);
  if (namas) data.pasirinkti_nt_tipai.push(2);
  if (kambarys) data.pasirinkti_nt_tipai.push(3);
  if (kotedzas) data.pasirinkti_nt_tipai.push(4);
  if (ofisas) data.pasirinkti_nt_tipai.push(5);
  if (kita) data.pasirinkti_nt_tipai.push(6);

  const issimoketa = searchParams.get("issimoketa") === "on";
  const neissimoketa = searchParams.get("neissimoketa") === "on";
  if (issimoketa) data.pasirinktos_paskolos_busenos.push(1);
  if (neissimoketa) data.pasirinktos_paskolos_busenos.push(2);

  return {
    ataskaitaData: await getAtaskaita(data),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const searchParams = new URLSearchParams();

  formData.forEach((value, key) => {
    searchParams.set(key, value);
  });

  return redirect("/ataskaita?" + searchParams.toString());
};

const AtaskaitaFirstPersonRow = ({ data }: { data: AtaskaitaModel }) => (
  <tr key={data.nt_objekto_id} className="">
    <td className="whitespace-nowrap font-medium">{data.vardas}</td>
    <td className="whitespace-nowrap font-medium">{data.pavarde}</td>
    <td className="whitespace-nowrap font-medium">
      {data.anonimizuotas_el_pastas}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.nekilnojamo_turto_kiekis}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.bendra_nekilnojamo_turto_verte.toFixed(2)}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.vidutinis_plotas.toFixed(2)}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.paskolu_kiekis ? data.paskolu_kiekis : "Nėra paskolų"}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.anksciausia_paskola
        ? new Date(data.anksciausia_paskola.split("T")[0]).toLocaleDateString(
            "lt-LT"
          )
        : "Nėra paskolų"}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.bendra_paskolu_suma ? data.bendra_paskolu_suma.toFixed(2) : "0"}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.mokejimu_kiekis ? data.mokejimu_kiekis : "Nėra mokejimų"}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.veliausias_mokejimas
        ? new Date(data.veliausias_mokejimas.split("T")[0]).toLocaleDateString(
            "lt-LT"
          )
        : "Nėra paskolų"}
    </td>
    <td className="whitespace-nowrap font-medium">
      {data.bendra_suma_mokejimai
        ? data.bendra_suma_mokejimai
        : "Nėra mokejimų"}
    </td>
    <td
      className={`whitespace-nowrap font-medium ${
        data.nekilnojamo_turto_kiekis > 1
          ? "border-b dark:border-neutral-500"
          : ""
      }`}
    >
      {data.nt_objekto_id}
    </td>
    <td
      className={`whitespace-nowrap font-medium ${
        data.nekilnojamo_turto_kiekis > 1
          ? "border-b dark:border-neutral-500"
          : ""
      }`}
    >
      {data.nt_plotas}
    </td>
    <td
      className={`whitespace-nowrap font-medium ${
        data.nekilnojamo_turto_kiekis > 1
          ? "border-b dark:border-neutral-500"
          : ""
      }`}
    >
      {data.nt_verte}
    </td>
    <td
      className={`whitespace-nowrap font-medium ${
        data.nekilnojamo_turto_kiekis > 1
          ? "border-b dark:border-neutral-500"
          : ""
      }`}
    >
      {data.nt_tipas}
    </td>
  </tr>
);

const AtaskaitaRow = ({ data }: { data: AtaskaitaModel }) => (
  <tr key={data.nt_objekto_id} className=" ">
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium"></td>
    <td className="whitespace-nowrap font-medium border-b dark:border-neutral-500">
      {data.nt_objekto_id}
    </td>
    <td className="whitespace-nowrap font-medium border-b dark:border-neutral-500">
      {data.nt_plotas}
    </td>
    <td className="whitespace-nowrap font-medium border-b dark:border-neutral-500">
      {data.nt_verte}
    </td>
    <td className="whitespace-nowrap font-medium border-b dark:border-neutral-500">
      {data.nt_tipas}
    </td>
  </tr>
);

export default function Ataskaita() {
  const { ataskaitaData } = useLoaderData<LoaderData>();

  const renderGroupResult = (data: AtaskaitaModel) => (
    <tr className="border-b dark:border-neutral-950">
      <td colSpan={16} className="whitespace-nowrap font-bold text-right">
        Iš viso grupėje: {data ? data.nekilnojamo_turto_kiekis : 0}
      </td>
    </tr>
  );

  const renderAllGroupsResult = (data: AtaskaitaModel) => (
    <tr className="border-b dark:border-neutral-500">
      <td colSpan={16} className="whitespace-nowrap font-extrabold text-right">
        Iš viso: {data ? data.kiek_is_viso_grupese : 0}
      </td>
    </tr>
  );

  let prevAsmensKodas = -1;
  let arrayOfGroupRows: JSX.Element[] = [];
  for (let i = 0; i < ataskaitaData.length; i++) {
    if (ataskaitaData[i].asmens_kodas !== prevAsmensKodas) {
      if (prevAsmensKodas !== -1) {
        arrayOfGroupRows.push(renderGroupResult(ataskaitaData[i - 1]));
      }
      prevAsmensKodas = ataskaitaData[i].asmens_kodas;
      arrayOfGroupRows.push(
        <AtaskaitaFirstPersonRow data={ataskaitaData[i]} />
      );
    } else arrayOfGroupRows.push(<AtaskaitaRow data={ataskaitaData[i]} />);
  }
  arrayOfGroupRows.push(
    renderGroupResult(ataskaitaData[ataskaitaData.length - 1])
  );
  arrayOfGroupRows.push(
    renderAllGroupsResult(ataskaitaData[ataskaitaData.length - 1])
  );

  return (
    <div className="flex justify-center">
      <Outlet />
      <div className="flex justify-center flex-col">
        {/* apribojimu pasirinkimas */}
        <div className="flex justify-center">
          <Form action="/ataskaita" method="post" className="flex flex-row">
            {/* NT tipų checkbox pasirinkimas */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <label className="text-center">Nekilnojamo turto tipas</label>
                <div className="flex justify-center">
                  <div className="flex flex-row">
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Butas</label>
                      <input
                        type="checkbox"
                        name="butas"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Namas</label>
                      <input
                        type="checkbox"
                        name="namas"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Kambarys</label>
                      <input
                        type="checkbox"
                        name="kambarys"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Kotedžas</label>
                      <input
                        type="checkbox"
                        name="kotedzas"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Ofisas</label>
                      <input
                        type="checkbox"
                        name="ofisas"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-center">Kita</label>
                      <input
                        type="checkbox"
                        name="kita"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Minimalaus NT kiekio input */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <label className="text-center">Minimalus NT kiekis</label>
                <div className="flex justify-center">
                  <input
                    type="number"
                    name="minNT"
                    className="text-center"
                    min="0"
                    required
                    defaultValue={0}
                  />
                </div>
              </div>
            </div>
            {/* Minimalaus NT ploto input */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <label className="text-center">Minimalus NT plotas</label>
                <div className="flex justify-center">
                  <input
                    type="number"
                    name="minPlotas"
                    className="text-center"
                    defaultValue={0}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
            {/* Paskolų būsenų checkbox pasirinkimas */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <label className="text-center">Paskolos būsena</label>
                <div className="flex justify-center">
                  <div className="flex flex-row">
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Išsimokėta</label>
                      <input
                        type="checkbox"
                        name="issimoketa"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                    <div className="flex flex-col mr-1">
                      <label className="text-center">Neišsimokėta</label>
                      <input
                        type="checkbox"
                        name="neissimoketa"
                        className="text-center"
                        defaultChecked={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Minimali visų mokėjimų suma */}
            <div className="flex justify-center">
              <div className="flex flex-col">
                <label className="text-center">Minimali mokėjimų suma</label>
                <div className="flex justify-center">
                  <input
                    required
                    type="number"
                    defaultValue={0}
                    name="minMokejimuSuma"
                    className="text-center"
                    min="0"
                  />
                </div>
              </div>
            </div>
            {/* Mygtukas ieškojimui pagal pateiktus apribojimus */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Ieškoti
              </button>
            </div>
          </Form>
        </div>
        {/* lentele */}
        <table className="min-w-full text-center text-xs font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th>Vardas</th>
              <th>Pavardė</th>
              <th>Anonimiškas el. paštas</th>
              <th>Turimas NT kiekis</th>
              <th>Bendra NT verčių suma</th>
              <th>Vid. NT plotas</th>
              <th>Paskolų kiekis</th>
              <th>Pirmos suteiktos paskolos data</th>
              <th>Paskolų suma</th>
              <th>Mokėjimų kiekis</th>
              <th>Vėliausias mokėjimas</th>
              <th>Mokėjimų suma</th>
              <th>NT ID</th>
              <th>NT plotas</th>
              <th>NT vertė</th>
              <th>NT tipas</th>
            </tr>
          </thead>
          <tbody>{arrayOfGroupRows}</tbody>
        </table>
        <LiveReload />
      </div>
    </div>
  );
}
