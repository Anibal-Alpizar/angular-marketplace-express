import {Router} from 'express';
import {getPurchaseItemByUser,
        getPurchaseItemByVendor,
        detailsPurchaseItemByCustomer} from '../controller/purchaseItem.controller';

const router = Router();


router.get('/purchaseItem/', getPurchaseItemByUser);

router.get('/purchaseItemDetailsByCustomer/:id', detailsPurchaseItemByCustomer);

router.get('/purchaseItemByVendor', getPurchaseItemByVendor);


export default router;








