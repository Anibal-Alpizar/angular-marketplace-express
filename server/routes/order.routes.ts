import { Router } from 'express';
import { createOrder, confirmarOrder } from '../controller/order.controller';

const router = Router();

router.post('/create-order', confirmarOrder);

export default router;
