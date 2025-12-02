import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./src/config/db.js";
import { spinUp } from "./scripts/spin-up.js";
import { startServer } from "./src/server.js";

async function checkDatabaseReady() {
    try {
        console.log("🔍 Verificando estado do banco de dados...");

        // Tenta listar as tabelas
        const command = new ListTablesCommand({});
        const response = await client.send(command);

        const tables = response.TableNames || [];

        // Verifica se a tabela 'Coupons' existe
        if (tables.includes("Coupons")) {
            console.log("✅ Tabelas encontradas. O banco parece estar pronto.");
            return true;
        } else {
            console.log("⚠️ Tabela 'Coupons' não encontrada.");
            return false;
        }
    } catch (error) {
        console.log("❌ Não foi possível conectar ao banco (pode estar desligado).");
        return false;
    }
}

async function main() {
    // Verifica se precisa rodar o spin-up
    const isReady = await checkDatabaseReady();

    if (!isReady) {
        console.log("⚙️ Iniciando configuração de ambiente (Spin-up)...");
        await spinUp();
    }

    // Independente do que aconteceu acima, inicia o servidor
    console.log("🚀 Inicializando servidor...");
    startServer();
}

main();