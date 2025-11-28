import { exec } from "child_process";
import { createCouponsTable } from "../src/infra/create-tables.js";
import { configureTTL } from "../src/infra/ttl.js";
import { seed } from "./seed.js";
import { waitForDynamoReady } from "./utils/wait-for-db.js";
import { teardown } from "./teardown.js";

export async function waitForTableActive(tableName, timeout = 30000) {
  const { DescribeTableCommand } = await import("@aws-sdk/client-dynamodb");
  let active = false;
  const start = Date.now();

  while (!active) {
    if (Date.now() - start > timeout) {
      throw new Error(`Timeout: tabela ${tableName} não ficou ACTIVE em ${timeout}ms`);
    }
    try {
      const data = await client.send(new DescribeTableCommand({ TableName: tableName }));
      if (data.Table.TableStatus === "ACTIVE") active = true;
      else await new Promise(r => setTimeout(r, 1000));
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function startDynamoDB() {
  console.log("🚀 Verificando se Docker está disponível...");
  try {
    await runCommand("docker --version");
  } catch {
    throw new Error("Docker não encontrado. Instale Docker antes de continuar.");
  }

  console.log("⚙️ Removendo container antigo (se houver)...");
  try {
    await runCommand("docker rm -f dynamodb-local");
  } catch {
    // ignora erros
  }

  console.log("⏳ Iniciando DynamoDB Local...");
  await runCommand("docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local");

  console.log("⏳ Aguardando porta 8000 ficar disponível...");
  console.log("✅ DynamoDB Local pronto!");
}

async function spinUp() {
  try {
    await teardown(); // garante um ambiente limpo
    await startDynamoDB();
    await waitForDynamoReady();
    await createCouponsTable();
    await configureTTL();
    await seed();
    console.log("🎉 Spin-up completo! DynamoDB pronto para uso.");
  } catch (err) {
    console.error("❌ Erro no spin-up:", err);
  }
}
