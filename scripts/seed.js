import { CouponModel } from '../src/models/coupon.js';

// Dados iniciais
export async function runSeed() {
  try {
    console.log("Criando cupons de teste...");

    await CouponModel.create({
      code: "BEMVINDO10",
      description: "Desconto de boas vindas",
      type: "percentage",
      value: 10,
      maxUsage: 1000,
      validityHours: 48
    });

    await CouponModel.create({
      code: "VIP50",
      description: "Desconto fixo para Vips",
      type: "fixed",
      value: 50.00,
      maxUsage: 5, 
      validityHours: 24
    });

    console.log("Seed finalizado!");
  } catch (error) {
    console.error("Erro:", error.message);
  }
}