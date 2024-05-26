//import { contractCloud } from "./cloud";
import { contract } from "./contract";

export async function sign(value: number) {
  console.log(value);
  //return await contractCloud(value);
  return await contract(value);
}
