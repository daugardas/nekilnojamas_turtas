import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Nekilnojamas turtas" }];
};

export default function Index() {
  return <div>Hello Index Route</div>;
}
