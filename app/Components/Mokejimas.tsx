import { Link } from "@remix-run/react";
import { AsmuoModel } from "~/Models/AsmuoModel";
import { MokejimasModel } from "~/Models/MokejimasModel";

type MokejimasProps = {
  mokejimas: MokejimasModel;
};

export default function Mokejimas(props: MokejimasProps) {
  const { mokejimas } = props;
  return (
    <div>
          <div>
            <div>Išrašo nr.:</div>
            <div>{mokejimas.israso_nr}</div>
          </div>
          <div>
            <div>Išrašymo data:</div>
            <div>
              {new Date(mokejimas.israsymo_data).toLocaleDateString("lt-LT")}
            </div>
          </div>
          <div>
            <div>Suma:</div>
            <div>{mokejimas.suma}</div>
          </div>
          <div>
            <div>Pirkimo pardavimo sutarties nr.:</div>
            <div>{mokejimas.fk_PIRKIMO_PARDAVIMO_SUTARTISsutarties_nr}</div>
          </div>
          <div>
            <div>Paskolos nr.:</div>
            <div>{mokejimas.fk_PASKOLAnumeris}</div>
          </div>
        </div>
  );
}
