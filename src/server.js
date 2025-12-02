import express from 'express';
import cors from 'cors';
import couponsRoutes from './routes/couponRoutes.js'; // Importa o arquivo de rotas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Usa as rotas de cupons, prefixando com /coupons
app.use('/coupons', couponsRoutes);

export function startServer() {
    app.listen(PORT, () => {
        console.log(`API rodando em http://localhost:${PORT}`);
    });
}