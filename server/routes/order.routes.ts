import { Router } from 'express';
import { createOrder } from '../controller/order.controller';

const router = Router();

router.post('/create-order', createOrder);

export default router;
