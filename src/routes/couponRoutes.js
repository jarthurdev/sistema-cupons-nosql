import { Router } from 'express';
import { CouponController } from '../controllers/CouponController.js';

const router = Router();

// Definição das rotas e qual método do controller chama
router.post('/', CouponController.create);
router.get('/', CouponController.list);          // Agora suporta ?status=...
router.get('/:id', CouponController.getById);
router.put('/:id/status', CouponController.updateStatus);
router.delete('/:id', CouponController.delete);

export default router;