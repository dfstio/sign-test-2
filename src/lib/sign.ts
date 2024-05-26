import { contractCloud } from "./cloud";

export async function sign(value: number) {
  console.log(value);
  return await contractCloud(value);
}
