import { CouponModel } from '../models/Coupon.js';

export class CouponController {
    
    // POST /coupons
    static async create(req, res) {
        try {
            // Aqui mantemos a lógica de criação
            const coupon = await CouponModel.create(req.body);
            res.status(201).json(coupon);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // GET /coupons (Com suporte a filtro ?status=active)
    static async list(req, res) {
        try {
            const { status } = req.query;

            // Se a URL tiver ?status=..., usamos o método de filtro
            if (status) {
                console.log(`🔎 Filtrando por status: ${status}`);
                const coupons = await CouponModel.getByStatus(status);
                return res.json(coupons);
            }

            // Se não, lista tudo
            const coupons = await CouponModel.listAll();
            res.json(coupons);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /coupons/:id
    static async getById(req, res) {
        try {
            const coupon = await CouponModel.getById(req.params.id);
            if (!coupon) {
                return res.status(404).json({ error: 'Cupom não encontrado' });
            }
            res.json(coupon);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // PUT /coupons/:id/status
    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ error: 'Status é obrigatório' });
            }

            const result = await CouponModel.updateStatus(req.params.id, status);
            res.json({ message: 'Status atualizado', result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // DELETE /coupons/:id
    static async delete(req, res) {
        try {
            await CouponModel.delete(req.params.id);
            res.status(200).json({ message: "Cupom apagado com sucesso" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}