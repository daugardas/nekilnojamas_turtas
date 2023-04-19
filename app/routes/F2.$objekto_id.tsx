import { ActionFunction, LoaderArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import { MysqlError } from "mysql";
import { useEffect, useState } from "react";
import { AsmuoModel } from "~/Models/AsmuoModel";
import { MokejimasModel } from "~/Models/MokejimasModel";
import { PaskolaModel } from "~/Models/PaskolaModel";
import { getAsmenys } from "~/Models/asmenys.server";
import { getMokejimai } from "~/Models/mokejimai.server";
import {
  getNekilnojamasTurtas,
  getNekilnojamasTurtasEnergetinesKlases,
  getNekilnojamasTurtasTipai,
} from "~/Models/nekilnojami-turtai.server";
import { getPaskolos, getPaskolosBusenos } from "~/Models/paskolos.server";
import { connection } from "~/entry.server";
import { sendQuery } from "~/Services/queryDB";

type LoaderData = {
  asmenys: Awaited<ReturnType<typeof getAsmenys>>;
  ntTipai: Awaited<ReturnType<typeof getNekilnojamasTurtasTipai>>;
  paskolos: Awaited<ReturnType<typeof getPaskolos>>;
  energetinesKlases: Awaited<
    ReturnType<typeof getNekilnojamasTurtasEnergetinesKlases>
  >;
  mokejimai: Awaited<ReturnType<typeof getMokejimai>>;
  paskolosBusenos: Awaited<ReturnType<typeof getPaskolosBusenos>>;
  nekilnojamas_turtas: Awaited<ReturnType<typeof getNekilnojamasTurtas>>;
};

export const loader = async ({ params }: LoaderArgs): Promise<LoaderData> => {
  return {
    asmenys: await getAsmenys(),
    paskolos: await getPaskolos(),
    ntTipai: await getNekilnojamasTurtasTipai(),
    energetinesKlases: await getNekilnojamasTurtasEnergetinesKlases(),
    mokejimai: await getMokejimai(),
    paskolosBusenos: await getPaskolosBusenos(),
    nekilnojamas_turtas: await getNekilnojamasTurtas(
      params.objekto_id as string
    ),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  /* NT */
  console.log("Updating NT");
  const nt_plotas = form.get("plotas");
  const nt_pastatymo_metai = form.get("pastatymo_metai");
  const nt_renovacijos_metai = form.get("renovacijos_metai");
  const nt_adresas = form.get("adresas");
  const nt_verte = form.get("verte");
  const nt_tipas = form.get("tipas");
  const nt_energetine_klase = form.get("energetine_klase");
  const nt_savininko_asmens_kodas = form.get("asmens_kodas");

  const update_query = `
    UPDATE nekilnojami_turtai
    SET plotas = ${nt_plotas}, pastatymo_metai = DATE_FORMAT('${nt_pastatymo_metai}', '%Y-%m-%d'), renovacijos_metai = DATE_FORMAT('${nt_renovacijos_metai}', '%Y-%m-%d'), adresas = '${nt_adresas}', verte = ${nt_verte}, tipas = '${nt_tipas}', energine_klase = '${nt_energetine_klase}', fk_ASMUOasmens_kodas = '${nt_savininko_asmens_kodas}'
    WHERE objekto_id = ${form.get("objekto_id")}
    `;

  console.log(update_query);

  try {
    const responseFromDB = new Promise((resolve, reject) => {
      const stringWithoutNewLines = update_query.replace(/(\r\n|\n|\r)/gm, "");
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

  /* PASKOLOS */

  // firstly check which paskolos were already existing in the database, so that we only have to UPDATE them
  const existingPaskolos_query = `SELECT numeris FROM paskolos WHERE fk_ASMUOasmens_kodas=${nt_savininko_asmens_kodas}`;
  let existingPaskolos: { numeris: number }[] = [];
  try {
    const responseFromDB: { numeris: number }[] = await sendQuery(
      existingPaskolos_query
    );
    existingPaskolos = responseFromDB;
  } catch (err) {
    console.log(err);
  }

  console.log("Existing paskolos:", existingPaskolos);
  // now for each existing paskola we check it agains the paskolos that were sent from the frontend and if they match, we update them
  const paskolos: PaskolaModel[] = JSON.parse(form.get("paskolos") as string);
  let insertedPaskolaNewNumeriai: { prevId: number; newId: number }[] = [];
  for (const paskola of paskolos) {
    const {
      numeris,
      suteikianti_imone,
      suma,
      palukanos,
      suteikimo_data,
      busena,
      fk_ASMUOasmens_kodas,
    } = paskola;

    const existingPaskola = existingPaskolos.find(
      (paskola) => paskola.numeris === numeris
    );

    if (existingPaskola) {
      const updatePaskola_query = `
      UPDATE paskolos
      SET suteikianti_imone = '${suteikianti_imone}', suma = ${suma}, palukanos = ${palukanos}, suteikimo_data = DATE_FORMAT('${suteikimo_data}', '%Y-%m-%d'), busena = '${busena}', fk_ASMUOasmens_kodas = '${fk_ASMUOasmens_kodas}'
      WHERE numeris = ${numeris}
      `;
      try {
        const responseFromDB = await sendQuery(updatePaskola_query);
      } catch (err) {
        console.log(err);
      }
    } else {
      const insertPaskola_query = `
      INSERT INTO paskolos
      (suteikianti_imone, suma, palukanos, suteikimo_data, busena, fk_ASMUOasmens_kodas)
      VALUES
      ('${suteikianti_imone}', ${suma}, ${palukanos}, DATE_FORMAT('${suteikimo_data}', '%Y-%m-%d'), '${busena}', '${fk_ASMUOasmens_kodas}')
      `;
      try {
        const responseFromDB: any = await sendQuery(insertPaskola_query);
        insertedPaskolaNewNumeriai.push({
          prevId: numeris,
          newId: responseFromDB.insertId,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  // now we have to delete all paskolos that were not sent from the frontend, because user wanted to delete them
  const paskolosToDelete = paskolos.map((paskola) => paskola.numeris);

  const deletePaskolos_query = `
  DELETE FROM paskolos
  WHERE fk_ASMUOasmens_kodas=${nt_savininko_asmens_kodas} AND numeris NOT IN (${paskolosToDelete})
  `;
  try {
    const responseFromDB = await sendQuery(deletePaskolos_query);
  } catch (err) {
    console.log(err);
  }

  // now that we have also inserted new paskolos, we have to update the mokejimai which were still not updated in database or inserted
  // we already know the new generated numeris for the inserted paskolas (variable 'insertedPaskolaNewNumeriai'), so we can use it to update the mokejimai
  const newMokejimai: MokejimasModel[] = JSON.parse(
    form.get("mokejimai") as string
  );

  let existingMokejimaiInDB: MokejimasModel[] = [];
  const existingMokejimai_query = `SELECT * FROM mokejimai WHERE fk_ASMUOasmens_kodas=${nt_savininko_asmens_kodas}`;
  try {
    const responseFromDB: MokejimasModel[] = await sendQuery(
      existingMokejimai_query
    );
    existingMokejimaiInDB = responseFromDB;
  } catch (err) {
    console.log(err);
  }

  console.log("Existing mokejimai:", existingMokejimaiInDB);

  for (const mokejimas of newMokejimai) {
    const {
      israso_nr,
      israsymo_data,
      suma,
      fk_ASMUOasmens_kodas,
      fk_PASKOLAnumeris,
    } = mokejimas;

    const existingMokejimas = existingMokejimaiInDB.find(
      (mokejimas) => mokejimas.israso_nr === israso_nr
    );

    if (existingMokejimas) {
      const updateMokejimas_query = `
      UPDATE mokejimai
      SET suma = ${suma}, fk_ASMUOasmens_kodas = '${fk_ASMUOasmens_kodas}', fk_PASKOLAnumeris = ${fk_PASKOLAnumeris}
      WHERE israsymo_data = DATE_FORMAT('${israsymo_data}', '%Y-%m-%d') AND fk_PASKOLAnumeris = ${fk_PASKOLAnumeris}
      `;
      try {
        const responseFromDB = await sendQuery(updateMokejimas_query);
        console.log("Updated mokejimas:", responseFromDB);
      } catch (err) {
        console.log(err);
      }
    } else {
      const insertMokejimas_query = `
      INSERT INTO mokejimai
      (israsymo_data, suma, fk_ASMUOasmens_kodas, fk_PASKOLAnumeris)
      VALUES
      (DATE_FORMAT('${israsymo_data}', '%Y-%m-%d'), ${suma}, '${fk_ASMUOasmens_kodas}', ${fk_PASKOLAnumeris})
      `;
      try {
        const responseFromDB = await sendQuery(insertMokejimas_query);
        console.log("Inserted new mokejimas:", responseFromDB);
      } catch (err) {
        console.log(err);
      }
    }
  }

  // now we have to delete all mokejimai that were not sent from the frontend, because user wanted to delete them
  const mokejimaiToDelete = newMokejimai.map(
    (mokejimas) => mokejimas.israso_nr
  );

  const deleteMokejimai_query = `
  DELETE FROM mokejimai
  WHERE fk_ASMUOasmens_kodas=${nt_savininko_asmens_kodas} AND israso_nr NOT IN (${mokejimaiToDelete})
  `;
  try {
    const responseFromDB = await sendQuery(deleteMokejimai_query);
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
    nekilnojamas_turtas,
  } = useLoaderData<LoaderData>();
  const data = useActionData();
  const submit = useSubmit();

  const [savininkas, setSavininkas] = useState<AsmuoModel | null>(null);
  const [paskolosOfAsmuo, setPaskolosOfAsmuo] = useState<PaskolaModel[] | null>(
    null
  );
  const [mokejimaiOfAsmuo, setMokejimaiOfAsmuo] = useState<
    MokejimasModel[] | null
  >(null);
  useEffect(() => {
    if (
      savininkas == null &&
      asmenys.length > 0 &&
      nekilnojamas_turtas != null
    ) {
      const nt_savininkas = asmenys.find((a) => {
        return a.asmens_kodas == nekilnojamas_turtas.fk_ASMUOasmens_kodas;
      });
      if (nt_savininkas != null)
        setSavininkas({
          asmens_kodas: nt_savininkas.asmens_kodas,
          vardas: nt_savininkas.vardas,
          pavarde: nt_savininkas.pavarde,
          gimimo_data: nt_savininkas.gimimo_data,
          tel_nr: nt_savininkas.tel_nr,
          el_pastas: nt_savininkas.el_pastas,
          deklaruota_gyv_vieta: nt_savininkas.deklaruota_gyv_vieta,
        });
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
    let newNumeris =
      paskolos.reduce((max, p) => Math.max(p.numeris, max), 0) + 1;
    let paskolosOfAsmuoHighestNumeris: number = 0;
    if (paskolosOfAsmuo != null)
      paskolosOfAsmuoHighestNumeris =
        paskolosOfAsmuo?.reduce((max, p) => Math.max(p.numeris, max), 0) + 1;

    const paskola: PaskolaModel = {
      numeris:
        newNumeris > paskolosOfAsmuoHighestNumeris
          ? newNumeris
          : paskolosOfAsmuoHighestNumeris,
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

  const onChangePaskola = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    paskola: PaskolaModel
  ) => {
    let newPaskola: PaskolaModel;

    if (e.target.name === "suma" || e.target.name === "palukanos") {
      newPaskola = {
        ...paskola,
        [e.target.name]: Number(e.target.value),
      };
    } else {
      newPaskola = {
        ...paskola,
        [e.target.name]: e.target.value,
      };
    }

    console.log(e.target.name, newPaskola);
    const newPaskolos = paskolosOfAsmuo?.map((p) => {
      if (p === paskola) return newPaskola;
      return p;
    });
    if (newPaskolos != null) setPaskolosOfAsmuo(newPaskolos);
  };

  const onClickAddMokejimas = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let newNumeris =
      mokejimai.reduce((max, m) => Math.max(m.israso_nr, max), 0) + 1;
    let mokejimaiOfAsmuoHighestNumeris: number = 0;
    if (mokejimaiOfAsmuo != null)
      mokejimaiOfAsmuoHighestNumeris =
        mokejimaiOfAsmuo?.reduce((max, m) => Math.max(m.israso_nr, max), 0) + 1;

    const mokejimas: MokejimasModel = {
      israso_nr:
        newNumeris > mokejimaiOfAsmuoHighestNumeris
          ? newNumeris
          : mokejimaiOfAsmuoHighestNumeris,
      suma: 0,
      israsymo_data: new Date().toLocaleDateString("lt-LT"),
      fk_ASMUOasmens_kodas: savininkas?.asmens_kodas as number,
      fk_PASKOLAnumeris: paskolosOfAsmuo?.[0].numeris as number,
    };

    if (mokejimaiOfAsmuo == null) setMokejimaiOfAsmuo([mokejimas]);
    else setMokejimaiOfAsmuo([...mokejimaiOfAsmuo, mokejimas]);
  };

  const onClickRemovePaskola = (rmPaskola: PaskolaModel) => {
    /* let formData = new FormData();
    formData.append("numeris", numeris.toString());

    submit(formData, { method: "DELETE", action: "/paskolos/delete" }); */
    const newPaskolos = paskolosOfAsmuo?.filter((p) => p != rmPaskola);
    if (newPaskolos != null) setPaskolosOfAsmuo(newPaskolos);
  };

  const onClickRemoveMokejimas = (rmMokejimas: MokejimasModel) => {
    /* let formData = new FormData();
    formData.append("israso_nr", israso_nr.toString());

    submit(formData, { method: "DELETE", action: "/mokejimai/delete" }); */
    const newMokejimai = mokejimaiOfAsmuo?.filter((m) => m != rmMokejimas);
    if (newMokejimai != null) setMokejimaiOfAsmuo(newMokejimai);
  };

  const onChangeMokejimas = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    mokejimas: MokejimasModel
  ) => {
    let newMokejimas: MokejimasModel;

    if (e.target.name === "suma" || e.target.name === "fk_PASKOLAnumeris") {
      newMokejimas = {
        ...mokejimas,
        [e.target.name]: Number(e.target.value),
      };
    } else {
      newMokejimas = {
        ...mokejimas,
        [e.target.name]: e.target.value,
      };
    }

    console.log(e.target.name, newMokejimas);
    const newMokejimai = mokejimaiOfAsmuo?.map((m) => {
      if (m === mokejimas) return newMokejimas;
      return m;
    });

    console.log(newMokejimai);
    if (newMokejimai != null) setMokejimaiOfAsmuo(newMokejimai);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    formData.append("objekto_id", nekilnojamas_turtas.objekto_id.toString());
    // submit nekilnojamas turtas
    /*  submit(formData, { method: "PUT" }); */

    // first remove previous paskolos and mokejimai
    if (savininkas) {
      /* formData = new FormData(); */
      formData.append("asmens_kodas", savininkas.asmens_kodas.toString());

      /* submit(formData, { method: "DELETE", action: "/paskolos/delete" });
      submit(formData, { method: "DELETE", action: "/mokejimai/delete" }); */
    }

    // submit paskolos

    formData.append("paskolos", JSON.stringify(paskolosOfAsmuo));
    /* paskolosOfAsmuo.forEach((paskola) => {
        formData = new FormData();
        formData.append("suteikianti_imone", paskola.suteikianti_imone);
        formData.append("suma", paskola.suma.toString());
        formData.append("palukanos", paskola.palukanos.toString());
        formData.append("suteikimo_data", paskola.suteikimo_data);
        formData.append(
          "paskutinio_mokejimo_data",
          new Date().toLocaleDateString("lt-LT")
        );
        formData.append("busena", paskola.busena.toString());
        formData.append(
          "fk_ASMUOasmens_kodas",
          paskola.fk_ASMUOasmens_kodas.toString()
        );

        submit(formData, { method: "POST", action: "/paskolos/create" });
      }); */

    // submit mokejimai

    formData.append("mokejimai", JSON.stringify(mokejimaiOfAsmuo));
    /* mokejimaiOfAsmuo.forEach((mokejimas) => {
        formData = new FormData();
        formData.append("suma", mokejimas.suma.toString());
        formData.append(
          "israsymo_data",
          new Date().toLocaleDateString("lt-LT")
        );
        formData.append(
          "fk_ASMUOasmens_kodas",
          mokejimas.fk_ASMUOasmens_kodas.toString()
        );
        formData.append(
          "fk_PASKOLAnumeris",
          mokejimas.fk_PASKOLAnumeris.toString()
        );

        submit(formData, { method: "POST", action: "/mokejimai/create" });
      }); */

    submit(formData, { method: "PUT" });
  };

  return (
    <div className="flex justify-center">
      <Form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
        onSubmit={onSubmit}
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
              defaultValue={nekilnojamas_turtas.plotas}
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
              defaultValue={nekilnojamas_turtas.pastatymo_metai.split("T")[0]}
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
              defaultValue={nekilnojamas_turtas.renovacijos_metai.split("T")[0]}
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
              defaultValue={nekilnojamas_turtas.adresas}
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
              defaultValue={nekilnojamas_turtas.verte}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Tipas</label>
            <select
              defaultValue={nekilnojamas_turtas.tipas}
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
              defaultValue={nekilnojamas_turtas.energine_klase}
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
                  Paskolos nr.
                </label>
                <div>{paskola.numeris}</div>
              </div>
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
                  onChange={(e) => onChangePaskola(e, paskola)}
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
                  onChange={(e) => onChangePaskola(e, paskola)}
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
                  onChange={(e) => onChangePaskola(e, paskola)}
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
                  onChange={(e) => onChangePaskola(e, paskola)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Būsena
                </label>
                <select
                  value={paskola.busena}
                  onChange={(e) => onChangePaskola(e, paskola)}
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onClickRemovePaskola(paskola);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
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
            <div key={mokejimas.israso_nr} className="flex flex-row">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Mokėjimo suma
                </label>
                <input
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="suma"
                  type="text"
                  placeholder="Mokėjimo suma"
                  name="suma"
                  value={mokejimas.suma}
                  onChange={(e) => onChangeMokejimas(e, mokejimas)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Paskola
                </label>
                <select
                  value={mokejimas.fk_PASKOLAnumeris}
                  onChange={(e) => onChangeMokejimas(e, mokejimas)}
                  name="fk_PASKOLAnumeris"
                  id="fk_PASKOLAnumeris"
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
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onClickRemoveMokejimas(mokejimas);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
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
