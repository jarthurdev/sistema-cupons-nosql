import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { client } from "../../src/config/db.js"; // Caminho corrigido

const docClient = DynamoDBDocumentClient.from(client);

async function testRead() {
  console.log("🔎 Buscando cupom BEMVINDO10...");

  const command = new GetCommand({
    TableName: "Coupons",
    Key: {
      couponId: "BEMVINDO10" // Buscando pela PK correta
    }
  });

  try {
    const result = await docClient.send(command);
    
    if (result.Item) {
      console.log("✅ Cupom encontrado:");
      console.log(JSON.stringify(result.Item, null, 2));
    } else {
      console.log("⚠️ Cupom não encontrado (verifique se rodou o seed).");
    }
  } catch (error) {
    console.error("❌ Erro na leitura:", error);
  }
}

testRead();