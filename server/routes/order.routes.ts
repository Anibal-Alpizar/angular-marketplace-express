import { Router } from 'express';
import { createOrder, getPurchaseByCustumer } from '../controller/order.controller';


const router = Router();
router.get('/orderByCustumer/:id', getPurchaseByCustumer);
router.post('/create-order', createOrder);

export default router;
