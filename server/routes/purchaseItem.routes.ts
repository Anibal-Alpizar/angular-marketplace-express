import {Router} from 'express';
import {getPurchaseItemByUser,
        getPurchaseItemByVendor,
        detailsPurchaseItemByCustomer} from '../controller/purchaseItem.controller';

const router = Router();

router.get('/purchaseItem/:id', getPurchaseItemByUser);

router.get('/purchaseItemByVendor', getPurchaseItemByVendor);

router.get('/purchaseItemDetailsByCustomer', detailsPurchaseItemByCustomer);

export default router;








