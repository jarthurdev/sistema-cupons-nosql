import express from 'express';
import cors from 'cors';
import { CouponModel } from './models/Coupon.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post('/coupons', async (req, res) => {
    try {
        const coupon = await CouponModel.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. GET - Listar TODOS
app.get('/coupons', async (req, res) => {
    try {
        const coupons = await CouponModel.listAll();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. GET - Buscar por ID
app.get('/coupons/:id', async (req, res) => {
    try {
        const coupon = await CouponModel.getById(req.params.id);
        if (!coupon) return res.status(404).json({ error: 'Cupom não encontrado' });
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. PUT - Atualizar Status
app.put('/coupons/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: 'Status é obrigatório' });

        const result = await CouponModel.updateStatus(req.params.id, status);
        res.json({ message: 'Status atualizado', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. DELETE - Remover
app.delete('/coupons/:id', async (req, res) => {
    try {
        await CouponModel.delete(req.params.id);
        res.json({message: "Cupom apagado"})
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
});