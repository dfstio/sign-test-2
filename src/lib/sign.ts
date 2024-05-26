"use server";
import { Field, initializeBindings } from "o1js";

export async function sign(value: number) {
  console.log("sign 1", value);
  //const { Field, initializeBindings } = await import("o1js");
  //await initializeBindings();
  const field = Field(value);
  console.log("field", field.toJSON());
  //const sum = value + 10;
  const sum = field.add(10);
  console.log("sign 2", sum.toJSON());
  return Number(sum.toBigInt());
}
