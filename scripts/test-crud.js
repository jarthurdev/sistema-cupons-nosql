import { CouponModel } from '../src/models/Coupon.js';

async function runTest() {
  const TEST_CODE = "TESTE_CRUD_2025";

  console.log("--- 🚀 INICIANDO TESTE DE CRUD BÁSICO ---");

  try {
    // 1. CREATE
    console.log("\n1️⃣  CRIAR: Tentando criar um cupom...");
    await CouponModel.create({
      code: TEST_CODE,
      description: "Cupom para teste automatizado",
      type: "fixed",
      value: 15.00,
      validityHours: 24
    });

    // 2. READ
    console.log("\n2️⃣  LER: Buscando o cupom no banco...");
    const cupom = await CouponModel.getById(TEST_CODE);
    
    if (cupom) {
      console.log(`   ✅ Encontrado! Status atual: ${cupom.status}`);
      console.log(`   📅 Criado em: ${cupom.createdAt}`);
    } else {
      console.error("   ❌ Erro: Cupom não foi encontrado logo após criar.");
      return;
    }

    // 3. UPDATE
    console.log("\n3️⃣  ATUALIZAR: Desativando o cupom (paused)...");
    const atualizado = await CouponModel.updateStatus(TEST_CODE, "paused");
    console.log(`   ✅ Novo status no banco: ${atualizado.status}`);

    // 4. DELETE
    console.log("\n4️⃣  DELETAR: Removendo o cupom...");
    await CouponModel.delete(TEST_CODE);

    // 5. VERIFICAÇÃO
    const check = await CouponModel.getById(TEST_CODE);
    if (!check) {
      console.log("   ✅ Sucesso! O cupom sumiu do banco.");
    } else {
      console.error("   ❌ Erro: O cupom ainda existe!");
    }

  } catch (error) {
    console.error("\n❌ ERRO FATAL NO TESTE:", error);
  } finally {
    console.log("\n--- FIM DO TESTE ---");
  }
}

runTest();