import { Router } from 'express';
import {
  getInfrastructureStatus,
  getMaintenanceTickets,
  createMaintenanceTicket,
} from '../controllers/infrastructure.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/status', getInfrastructureStatus);
router.get('/tickets', getMaintenanceTickets);
router.post('/tickets', createMaintenanceTicket);

export default router;
