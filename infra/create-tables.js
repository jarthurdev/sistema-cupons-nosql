// Importa AWS SDK
const AWS = require("aws-sdk");

// Configuração para DynamoDB Local
const dynamoDB = new AWS.DynamoDB({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
});

// Nome da tabela
const TABLE_NAME = "Coupons";

// Configuração da tabela
const params = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" }, // Partition Key
    { AttributeName: "SK", KeyType: "RANGE" }, // Sort Key
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "clientId", AttributeType: "S" }, // para GSI1
    { AttributeName: "status", AttributeType: "S" },   // para GSI2
    { AttributeName: "date", AttributeType: "S" },     // para GSI3
  ],
  BillingMode: "PAY_PER_REQUEST", // sem precisar configurar capacidade
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1_Client",
      KeySchema: [
        { AttributeName: "clientId", KeyType: "HASH" },
        { AttributeName: "createdAt", KeyType: "RANGE" },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI2_Status",
      KeySchema: [
        { AttributeName: "status", KeyType: "HASH" },
        { AttributeName: "expiresAt", KeyType: "RANGE" },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
    {
      IndexName: "GSI3_Date",
      KeySchema: [
        { AttributeName: "date", KeyType: "HASH" },
        { AttributeName: "PK", KeyType: "RANGE" },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
    },
  ],
  TimeToLiveSpecification: {
    AttributeName: "expiresAt",
    Enabled: true,
  },
};

// Função idempotente para criar a tabela
const createTable = async () => {
  try {
    // Verifica se a tabela já existe
    const existingTables = await dynamoDB.listTables({}).promise();
    if (existingTables.TableNames.includes(TABLE_NAME)) {
      console.log(`✅ Tabela ${TABLE_NAME} já existe. Nada a fazer.`);
      return;
    }

    // Cria tabela
    await dynamoDB.createTable(params).promise();
    console.log(`🚀 Tabela ${TABLE_NAME} criada com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao criar tabela:", error);
  }
};

// Executa a função
createTable();
