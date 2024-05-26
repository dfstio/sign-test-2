"use client";

import { serializeTransaction } from "./serialize";
import { sendTransaction } from "./send";

export async function contractCloud(
  value: number
): Promise<{ isSent: boolean; hash?: string }> {
  console.log("Contract cloud", value);
  const accounts = await (window as any)?.mina?.requestAccounts();
  console.log("Accounts", accounts);
  let address = "";
  if (accounts?.code === undefined && accounts?.length > 0) {
    address = accounts[0];
    console.log("Address", address);
  } else return { isSent: false };
  const { PublicKey, Mina, Field, fetchAccount } = await import("o1js");

  const sender = PublicKey.fromBase58(address);
  console.log("Sender", sender.toBase58());
  const { SignTestContract, accountBalanceMina, initBlockchain } = await import(
    "minanft"
  );
  await initBlockchain("devnet");

  console.log("Sender balance", await accountBalanceMina(sender));
  const contractAddress =
    "B62qk7nXjEzGJdyQFNVs5UauASTQJgiJSBpHJmDcFTiYQrDDTGDsNFT";
  const zkAppPublicKey = PublicKey.fromBase58(contractAddress);

  console.time("transaction created");
  const zkApp = new SignTestContract(zkAppPublicKey);
  await fetchAccount({ publicKey: zkAppPublicKey });
  await fetchAccount({ publicKey: sender });
  const fee = 200_000_000;
  const memo = `value: ${value}`;
  const tx = await Mina.transaction({ sender, fee, memo }, async () => {
    await zkApp.setValue(Field(value));
  });
  console.timeEnd("transaction created");
  console.log("Tx created", tx);

  const transaction = tx.toJSON();
  const serializedTransaction = serializeTransaction(tx);
  const txResult = await (window as any).mina?.sendTransaction({
    transaction,
    onlySign: true,
    feePayer: {
      fee: fee,
      memo: memo,
    },
  });
  const signedData = txResult?.signedData;
  console.time("ProvedAndSent");
  const result = await sendTransaction({
    serializedTransaction,
    signedData,
    contractAddress,
    address,
    value,
  });
  console.timeEnd("ProvedAndSent");
  console.log("Result", result);

  return result;
}
