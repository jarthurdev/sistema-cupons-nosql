// src/scripts/seed.js
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../src/config/db.js"; // importa o client já configurado
import { CouponModel } from "../src/models/coupon.js";

// Cria o DocumentClient a partir do client
const docClient = DynamoDBDocumentClient.from(client);

// Dados iniciais
async function runSeed() {
  try {
    console.log("🌱 Criando cupons de teste...");

    await CouponModel.create({
      code: "BEMVINDO10",
      description: "Desconto de boas vindas",
      type: "percentage",
      value: 10,
      maxUsage: 1000,
      validityHours: 48 // 2 dias
    });

    await CouponModel.create({
      code: "VIP50",
      description: "Desconto fixo para Vips",
      type: "fixed",
      value: 50.00,
      maxUsage: 5, // Apenas 5 pessoas podem usar (Escassez)
      validityHours: 24
    });

    console.log("✅ Seed finalizado!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}
