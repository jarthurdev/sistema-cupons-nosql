// src/scripts/create-table.js
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../db.js";

export async function createCouponsTable() {
  const command = new CreateTableCommand({
    TableName: "Coupons",
    AttributeDefinitions: [
      { AttributeName: "couponId", AttributeType: "S" },
      { AttributeName: "clientId", AttributeType: "S" },
      { AttributeName: "status", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "couponId", KeyType: "HASH" },
    ],

    GlobalSecondaryIndexes: [
      {
        IndexName: "ClientIndex",
        KeySchema: [
          { AttributeName: "clientId", KeyType: "HASH" },
          { AttributeName: "status", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],

    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  try {
    const result = await client.send(command);
    console.log("Tabela criada com sucesso:", result);
  } catch (err) {
    console.error("Erro ao criar tabela:", err);
  }
}

createCouponsTable();
