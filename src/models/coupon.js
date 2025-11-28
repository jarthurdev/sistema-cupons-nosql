// src/models/Coupon.js
import { PutCommand } from "@aws-sdk/lib-dynamodb";
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

      createdAt: now.toISOString(),
      // Calcula TTL (expira em X dias)
      expiresAt: Math.floor(now.getTime() / 1000) + (data.validityHours * 3600)
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
}