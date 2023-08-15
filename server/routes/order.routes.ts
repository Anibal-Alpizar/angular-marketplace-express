import { Router } from 'express';
import { createOrder, getPurchaseByCustumer,details } from '../controller/order.controller';


const router = Router();
router.get('/orderByCustumer/:id', getPurchaseByCustumer);
router.get('/details/:id', details)
router.post('/create-order', createOrder);

export default router;
