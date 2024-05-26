"use server";

export async function sign(value: number) {
  console.log("sign 1", value);
  const sum = value + 10;
  console.log("sign 2", sum);
  return sum;
}
