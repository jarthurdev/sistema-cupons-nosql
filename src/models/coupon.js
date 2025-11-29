// src/models/Coupon.js
import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand,
  DynamoDBDocumentClient 
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { client } from "../config/db.js";

const docClient = DynamoDBDocumentClient.from(client);

export class CouponModel {
  static TABLE_NAME = "Coupons";

  /**
   * Cria um novo cupom no banco.
   * @param {Object} data - Dados do cupom
   */
  static async create(data) {
    const now = new Date();
    const vencimento = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    // Define estrutura padrão
    const item = {
      couponId: data.code.toUpperCase(), // PK é o código em maiúsculo
      description: data.description,
      status: "active",
      
      // Regras encapsuladas
      rules: {
        type: data.type || "fixed", 
        value: data.value,
        minOrderValue: data.minOrderValue || 0,
      },

      // Controle de Estoque
      quota: {
        max: data.maxUsage || 100,
        used: 0 // Começa com 0
      },

      createdAt: now.toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
      // Calcula TTL (expira em X dias)
      expiresAt: vencimento.toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' }),
    };

    // Salva no DynamoDB
    const command = new PutCommand({
      TableName: this.TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(couponId)"
    });

    try {
      // Usa o DocumentClient para enviar o comando
      await docClient.send(command); 
      console.log(`✅ Cupom ${item.couponId} criado!`);
      return item;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new Error("Cupom com este código já existe.");
      }
      throw error;
    }
  }

  static async getById(couponId) {
    const command = new GetCommand({
      TableName: this.TABLE_NAME,
      Key: { couponId: couponId.toUpperCase() }
    });

    const result = await docClient.send(command);
    return result.Item || null;
  }

  static async getByStatus(statusTarget) {
    // Usando Scan para filtrar por status
    // Note: Scan pode ser custoso para grandes tabelas
    const command = new ScanCommand({
      TableName: this.TABLE_NAME,
      FilterExpression: "#st = :s",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: { ":s": statusTarget }
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }

  static async listAll() {
    const command = new ScanCommand({
      TableName: this.TABLE_NAME
    });
    
    const result = await docClient.send(command);
    return result.Items || [];
  }

  static async updateStatus(couponId, newStatus) {
    const command = new UpdateCommand({
      TableName: this.TABLE_NAME,
      Key: { couponId: couponId.toUpperCase() },
      // UpdateExpression: Define o que será atualizado
      UpdateExpression: "set #st = :s",
      // Names: Mapeia o nome do atributo
      ExpressionAttributeNames: { "#st": "status" },
      // Values: Define os novos valores
      ExpressionAttributeValues: { ":s": newStatus },
      ReturnValues: "ALL_NEW" // Retorna o objeto atualizado
    });

    const result = await docClient.send(command);
    console.log(`🔄 Status de ${couponId} alterado para: ${newStatus}`);
    return result.Attributes;
  }
}