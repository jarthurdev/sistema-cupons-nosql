// scripts/utils/wait-for-db.js
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../src/config/db.js";

export async function waitForDynamoReady(timeout = 30000) {
  const start = Date.now();
  let ready = false;

  while (!ready) {
    try {
      await client.send(new ListTablesCommand({}));
      ready = true;
    } catch (err) {
      if (Date.now() - start > timeout) throw new Error("DynamoDB não ficou pronto a tempo");
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
