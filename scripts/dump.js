import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { client } from "../src/config/db.js";
import fs from 'fs';
import path from 'path';

const docClient = DynamoDBDocumentClient.from(client);

async function createDump() {
  console.log("📦 Iniciando Dump da tabela Coupons...");

  try {
    // Escaneia a tabela Coupons
    // Obs: Para tabelas grandes pode ser custoso
    const command = new ScanCommand({
      TableName: "Coupons"
    });

    const result = await docClient.send(command);
    const items = result.Items || [];

    // Prepara os dados para dump
    const dumpData = {
      timestamp: new Date().toISOString(),
      total: items.length,
      items: items
    };

    // Salva o dump em um arquivo JSON
    const filePath = path.resolve('./dump/dump.json');
    fs.writeFileSync(filePath, JSON.stringify(dumpData, null, 2));

    console.log(`✅ Dump criado com sucesso!`);
    console.log(`📂 Arquivo: ${filePath}`);
    console.log(`📊 Itens salvos: ${items.length}`);

  } catch (error) {
    console.error("❌ Erro ao criar dump:", error);
  }
}

createDump();