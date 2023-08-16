import { Router } from 'express';
import {
  createOrder,
  getPurchaseByCustumer,
  details,
  markOrderAsCompleted,
} from '../controller/order.controller';

const router = Router();
router.get('/orderByCustumer/:id', getPurchaseByCustumer);

router.get('/details/:id', details);

router.post('/create-order', createOrder);

router.patch('/mark-order-completed/:id', markOrderAsCompleted);

export default router;
