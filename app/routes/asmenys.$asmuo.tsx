import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Mokejimas from "~/Components/Mokejimas";
import { getAsmuo, getAsmuoMokejimai } from "~/Models/asmenys.server";

type LoaderData = {
  mokejimai: Awaited<ReturnType<typeof getAsmuoMokejimai>>;
  asmuo: Awaited<ReturnType<typeof getAsmuo>>;
};

export const loader = async ({ params }: LoaderArgs): Promise<LoaderData> => {
  return {
    mokejimai: await getAsmuoMokejimai(params.asmuo as string),
    asmuo: await getAsmuo(params.asmuo as string),
  };
};

export default function Asmuo() {
  const { mokejimai, asmuo } = useLoaderData<LoaderData>();
  console.log(mokejimai);
  console.log(asmuo);
  if (!asmuo) return <div>Asmuo nerastas</div>;
  return (
    <div>
      <div>
        <div>{asmuo.vardas}</div>
        <div>{asmuo.pavarde}</div>
        <div>{asmuo.asmens_kodas}</div>
        <div>{asmuo.gimimo_data}</div>
        <div>{asmuo.tel_nr}</div>
        <div>{asmuo.el_pastas}</div>
        <div>{asmuo.deklaruota_gyv_vieta}</div>
      </div>
      {mokejimai.map((mok) => (
        <Mokejimas key={mok.israso_nr} mokejimas={mok}></Mokejimas>
      ))}
    </div>
  );
}
