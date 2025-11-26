import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./db.js";

async function main() {
  const result = await db.send(new GetCommand({
    TableName: "CuponsTable",
    Key: { codigo: "DESCONTO10" }
  }));

  console.log("Cupom:", result);
}

main();
