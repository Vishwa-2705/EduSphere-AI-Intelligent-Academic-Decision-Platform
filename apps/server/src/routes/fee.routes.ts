import { Router } from 'express';
import {
  getMyFeeInvoice,
  payFeeOnline,
  getAdminFeeOverview,
} from '../controllers/fee.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/my-invoice', getMyFeeInvoice);
router.post('/pay', payFeeOnline);
router.get('/admin-overview', authorizeRoles(['ADMIN']), getAdminFeeOverview);

export default router;
