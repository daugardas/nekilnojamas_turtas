import { Link } from "@remix-run/react";
import { AsmuoModel } from "~/Models/AsmuoModel";
import { AsmuoMokejimaiN_turtasModel } from "~/Models/AsmuoMokejimaiN_turtasModel";

type AsmuoTRProps = {
  asmuo: AsmuoMokejimaiN_turtasModel;
};

export default function AsmuoTR(props: AsmuoTRProps) {
  const { asmuo } = props;
  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap  font-medium">{asmuo.asmens_kodas}</td>
      <td className="whitespace-nowrap  font-medium">{asmuo.vardas}</td>
      <td className="whitespace-nowrap  font-medium">{asmuo.pavarde}</td>
      <td className="whitespace-nowrap  font-medium">
        {new Date(asmuo.gimimo_data).toLocaleDateString("lt-LT")}
      </td>
      <td className="whitespace-nowrap  font-medium">{asmuo.tel_nr}</td>
      <td className="whitespace-nowrap  font-medium">{asmuo.el_pastas}</td>
      <td className="whitespace-nowrap  font-medium">
        {asmuo.deklaruota_gyv_vieta}
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
  );
}
