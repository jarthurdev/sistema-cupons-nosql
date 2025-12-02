import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { client } from "../src/config/db.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const docClient = DynamoDBDocumentClient.from(client);

async function restoreDump() {
    console.log("Iniciando restauração do banco de dados...");

    const dumpFile = path.join(projectRoot, 'dump', 'dump.json');

    // 1. Verificar se o arquivo existe
    if (!fs.existsSync(dumpFile)) {
        console.error("Arquivo 'dump/dump.json' não encontrado na raiz.");
        console.error("Execute 'npm run db:dump' primeiro.");
        return;
    }

    try {
        // 2. Ler e parsear o arquivo
        const rawData = fs.readFileSync(dumpFile, 'utf-8');
        const json = JSON.parse(rawData);
        const items = json.items || [];

        if (items.length === 0) {
            console.log("O arquivo de dump está vazio. Nada a restaurar.");
            return;
        }

        console.log(`Restaurando ${items.length} itens do backup de ${json.timestamp}...`);

        // 3. Inserir itens no DynamoDB
        let successCount = 0;

        for (const item of items) {
            const command = new PutCommand({
                TableName: "Coupons",
                Item: item
            });

            await docClient.send(command);
            successCount++;
            process.stdout.write("."); // Feedback visual de progresso
        }

        console.log(`\nRestauração concluída! ${successCount} itens inseridos.`);

    } catch (error) {
        console.error("\nErro durante a restauração:", error.message);
    }
}

restoreDump();