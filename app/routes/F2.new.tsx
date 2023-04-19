import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useActionData } from "@remix-run/react";
import { MysqlError } from "mysql";
import { useEffect, useState } from "react";
import { AsmuoModel } from "~/Models/AsmuoModel";
import { MokejimasModel } from "~/Models/MokejimasModel";
import { PaskolaModel } from "~/Models/PaskolaModel";
import { getAsmenys } from "~/Models/asmenys.server";
import { getMokejimai } from "~/Models/mokejimai.server";
import {
  getNekilnojamasTurtasEnergetinesKlases,
  getNekilnojamasTurtasTipai,
} from "~/Models/nekilnojami-turtai.server";
import { getPaskolos, getPaskolosBusenos } from "~/Models/paskolos.server";
import { connection } from "~/entry.server";

type LoaderData = {
  asmenys: Awaited<ReturnType<typeof getAsmenys>>;
  ntTipai: Awaited<ReturnType<typeof getNekilnojamasTurtasTipai>>;
  paskolos: Awaited<ReturnType<typeof getPaskolos>>;
  energetinesKlases: Awaited<
    ReturnType<typeof getNekilnojamasTurtasEnergetinesKlases>
  >;
  mokejimai: Awaited<ReturnType<typeof getMokejimai>>;
  paskolosBusenos: Awaited<ReturnType<typeof getPaskolosBusenos>>;
};

export const loader = async (): Promise<LoaderData> => {
  return {
    asmenys: await getAsmenys(),
    paskolos: await getPaskolos(),
    ntTipai: await getNekilnojamasTurtasTipai(),
    energetinesKlases: await getNekilnojamasTurtasEnergetinesKlases(),
    mokejimai: await getMokejimai(),
    paskolosBusenos: await getPaskolosBusenos(),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const nt_plotas = form.get("plotas");
  const nt_pastatymo_metai = form.get("pastatymo_metai");
  const nt_renovacijos_metai = form.get("renovacijos_metai");
  const nt_adresas = form.get("adresas");
  const nt_verte = form.get("verte");
  const nt_tipas = form.get("tipas");
  const nt_energetine_klase = form.get("energetine_klase");
  const nt_savininko_asmens_kodas = form.get("savininkas");

  const insert_query = `
    INSERT INTO nekilnojami_turtai (plotas, pastatymo_metai, renovacijos_metai, adresas, verte, tipas, energine_klase, fk_ASMUOasmens_kodas)
    VALUES (${nt_plotas}, DATE_FORMAT('${nt_pastatymo_metai}', '%Y-%m-%d'), DATE_FORMAT('${nt_renovacijos_metai}', '%Y-%m-%d'), '${nt_adresas}', ${nt_verte}, '${nt_tipas}', '${nt_energetine_klase}', ${nt_savininko_asmens_kodas})
  `;

  console.log(insert_query);

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
  return redirect("/F1");
};

export default function F2() {
  const {
    asmenys,
    paskolos,
    ntTipai,
    energetinesKlases,
    mokejimai,
    paskolosBusenos,
  } = useLoaderData<LoaderData>();

  const data = useActionData();

  const [savininkas, setSavininkas] = useState<AsmuoModel | null>(null);
  const [paskolosOfAsmuo, setPaskolosOfAsmuo] = useState<PaskolaModel[] | null>(
    null
  );
  const [mokejimaiOfAsmuo, setMokejimaiOfAsmuo] = useState<
    MokejimasModel[] | null
  >(null);
  useEffect(() => {
    if (savininkas == null && asmenys.length > 0) {
      setSavininkas(asmenys[0]);
    } else if (savininkas != null) {
      const paskolosOfAsmuo = paskolos.filter((paskola) => {
        return paskola.fk_ASMUOasmens_kodas == savininkas.asmens_kodas;
      });
      const mokejimaiOfAsmuo = mokejimai.filter((mokejimas) => {
        return (
          mokejimas.fk_ASMUOasmens_kodas == savininkas.asmens_kodas &&
          paskolosOfAsmuo.some((p) => p.numeris === mokejimas.fk_PASKOLAnumeris)
        );
      });
      setPaskolosOfAsmuo(paskolosOfAsmuo);
      setMokejimaiOfAsmuo(mokejimaiOfAsmuo);
    }
  }, [asmenys, savininkas, mokejimai, paskolos]);

  const onChangeSavininkas = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asmuo = asmenys.find(
      (a) => a.asmens_kodas.toString() == e.target.value
    );
    if (asmuo) {
      setSavininkas(asmuo);

      const paskolosOfAsmuo = paskolos.filter((paskola) => {
        return paskola.fk_ASMUOasmens_kodas == asmuo.asmens_kodas;
      });
      const mokejimaiOfAsmuo = mokejimai.filter((mokejimas) => {
        return (
          mokejimas.fk_ASMUOasmens_kodas == asmuo.asmens_kodas &&
          paskolosOfAsmuo.some((p) => p.numeris === mokejimas.fk_PASKOLAnumeris)
        );
      });
      setPaskolosOfAsmuo(paskolosOfAsmuo);
      setMokejimaiOfAsmuo(mokejimaiOfAsmuo);
    }
  };

  const onClickAddPaskola = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const paskola: PaskolaModel = {
      numeris: paskolos.length + 1,
      suteikianti_imone: "",
      palukanos: 0,
      suma: 0,
      suteikimo_data: new Date().toLocaleDateString("lt-LT"),
      busena: paskolosBusenos[1].busenos_id,
      fk_ASMUOasmens_kodas: savininkas?.asmens_kodas as number,
    };
    if (paskolosOfAsmuo == null) setPaskolosOfAsmuo([paskola]);
    else setPaskolosOfAsmuo([...paskolosOfAsmuo, paskola]);
  };

  const onClickAddMokejimas = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const mokejimas: MokejimasModel = {
      israso_nr: mokejimai.length + 1,
      suma: 0,
      israsymo_data: new Date().toLocaleDateString("lt-LT"),
      fk_ASMUOasmens_kodas: savininkas?.asmens_kodas as number,
      fk_PASKOLAnumeris: paskolosOfAsmuo?.[0].numeris as number,
    };

    if (mokejimaiOfAsmuo == null) setMokejimaiOfAsmuo([mokejimas]);
    else setMokejimaiOfAsmuo([...mokejimaiOfAsmuo, mokejimas]);
  };

  return (
    <div className="flex justify-center">
      <Form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
        method="post"
      >
        {/* NAUJAS NT IR SAVININKAS */}
        <div className="flex flex-row">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Plotas</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="plotas"
              type="text"
              placeholder="Plotas"
              name="plotas"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Pastatymo metai
            </label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="pastatymo_metai"
              type="date"
              placeholder="Pastatymo metai"
              name="pastatymo_metai"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Renovacijos metai
            </label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="renovacijos_metai"
              type="date"
              placeholder="Renovacijos metai"
              name="renovacijos_metai"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Adresas
            </label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="adresas"
              type="text"
              placeholder="Adresas"
              name="adresas"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Vertė</label>
            <input
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="verte"
              type="text"
              placeholder="Vertė"
              name="verte"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tipas</label>
            <select
              name="tipas"
              id="tipas"
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {ntTipai.map((tipas) => (
                <option key={tipas.tipoID} value={tipas.tipoID}>
                  {tipas.pavadinimas}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Energetinė klasė
            </label>
            <select
              name="energetine_klase"
              id="energetine_klase"
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {energetinesKlases.map((klase) => (
                <option
                  key={klase.energinesKlasesID}
                  value={klase.energinesKlasesID}
                >
                  {klase.pavadinimas}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Naujas savininkas
            </label>
            <select
              onChange={onChangeSavininkas}
              value={savininkas?.asmens_kodas}
              name="savininkas"
              id="savininkas"
              className="block w-full bg-gray-200 border border-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {asmenys.map((asmuo: AsmuoModel) => (
                <option key={asmuo.asmens_kodas} value={asmuo.asmens_kodas}>
                  {asmuo.vardas} {asmuo.pavarde}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PASKOLOS */}
        <div className="block text-gray-700 font-bold mb-2">Paskolos</div>

        {paskolosOfAsmuo ? (
          paskolosOfAsmuo.map((paskola) => (
            <div className="flex flex-row" key={paskola.numeris}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Suteikianti įmonė
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="suteikianti_imone"
                  type="text"
                  placeholder="Suteikianti įmonė"
                  name="suteikianti_imone"
                  value={paskola.suteikianti_imone}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Suma
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="suma"
                  type="text"
                  placeholder="Suma"
                  name="suma"
                  value={paskola.suma}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Palūkanos
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="palukanos"
                  type="text"
                  placeholder="Palūkanos"
                  name="palukanos"
                  value={paskola.palukanos}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Suteikimo data
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="suteikimo_data"
                  type="date"
                  placeholder="Suteikimo data"
                  name="suteikimo_data"
                  value={paskola.suteikimo_data.split("T")[0]}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Būsena
                </label>
                <select
                  value={paskola.busena}
                  name="busena"
                  id="busena"
                  className="block w-full bg-gray-200 border border-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {paskolosBusenos.map((busena) => (
                    <option key={busena.busenos_id} value={busena.busenos_id}>
                      {busena.busena}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Šalinti
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>Nėra paskolų</div>
        )}
        <div>
          <button
            type="button"
            onClick={onClickAddPaskola}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Pridėti naują paskolą
          </button>
        </div>
        {/* END OF PASKOLOS */}
        {/* PASKOLU MOKEJIMAI */}
        <div className="block text-gray-700 font-bold mb-2">
          Paskolų mokėjimai
        </div>

        {mokejimaiOfAsmuo ? (
          mokejimaiOfAsmuo.map((mokejimas) => (
            <div className="flex flex-row">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Mokėjimo suma
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="mokejimo_suma"
                  type="text"
                  placeholder="Mokėjimo suma"
                  name="mokejimo_suma"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Paskola
                </label>
                <select
                  name="paskola"
                  id="paskola"
                  className="block w-full bg-gray-200 border border-gray-200 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {paskolosOfAsmuo
                    ? paskolosOfAsmuo.map((paskola) => (
                        <option key={paskola.numeris} value={paskola.numeris}>
                          Nr. {paskola.numeris}
                        </option>
                      ))
                    : null}
                </select>
              </div>
              <div className="flex">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  Šalinti
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>Nėra mokėjimų</div>
        )}
        <div>
          <button
            type="button"
            onClick={onClickAddMokejimas}
            className={` text-white font-bold py-2 px-4 rounded ${
              paskolosOfAsmuo?.length === 0
                ? `bg-gray-300 pointer-events-none`
                : `bg-blue-500 hover:bg-blue-700`
            }`}
            disabled={paskolosOfAsmuo?.length === 0}
          >
            Pridėti naują mokėjimą
          </button>
        </div>
        {/* END OF PASKOLU MOKEJIMAI */}

        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Išsaugoti
          </button>
          <Link
            to={`/F1`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Atšaukti
          </Link>
        </div>
      </Form>
    </div>
  );
}
