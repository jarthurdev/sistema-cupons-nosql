// src/scripts/seed.js
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "./db.js"; // importa o client já configurado

// Cria o DocumentClient a partir do client
const docClient = DynamoDBDocumentClient.from(client);

// Dados iniciais
const initialCoupons = [
  {
    couponId: "C1",
    clientId: "U1",
    status: "active",
    createdAt: Date.now(),
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
  },
  {
    couponId: "C2",
    clientId: "U1",
    status: "canceled",
    createdAt: Date.now(),
    expiresAt: Math.floor(Date.now() / 1000) + 7200,
  },
  {
    couponId: "C3",
    clientId: "U2",
    status: "active",
    createdAt: Date.now(),
    expiresAt: Math.floor(Date.now() / 1000) + 10800,
  },
];

export async function seed() {
  try {
    for (const coupon of initialCoupons) {
      await docClient.send(
        new PutCommand({
          TableName: "Coupons",
          Item: coupon,
        })
      );
    }
    console.log("🌱 Seed executado com sucesso!");
  } catch (err) {
    console.error("❌ Erro no seed:", err);
  }
}

// Permite rodar isoladamente
if (process.argv[1].endsWith("seed.js")) {
  seed();
}
