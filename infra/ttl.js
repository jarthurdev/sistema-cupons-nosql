import { UpdateTimeToLiveCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../db.js";

export async function configureTTL() {
  const command = new UpdateTimeToLiveCommand({
    TableName: "Coupons",
    TimeToLiveSpecification: {
      Enabled: true,
      AttributeName: "expiresAt",
    },
  });

  try {
    await client.send(command);
    console.log("TTL configurado com sucesso!");
  } catch (err) {
    console.error("Erro ao configurar TTL:", err);
  }
}

configureTTL();
