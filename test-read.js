import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./db.js";

async function testRead() {
  const params = {
    TableName: "Coupons",
    IndexName: "ClientIndex",
    KeyConditionExpression: "clientId = :c",
    ExpressionAttributeValues: {
      ":c": { S: "U1" }
    }
  };

  const result = await client.send(new QueryCommand(params));
  console.log(result.Items);
}

testRead();
