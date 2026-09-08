import { Router } from 'express';
import {
  getMentees,
  logIntervention,
  updateInterventionStatus,
} from '../controllers/mentorship.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/mentees', authorizeRoles(['MENTOR', 'ADMIN']), getMentees);
router.post('/interventions', authorizeRoles(['MENTOR', 'ADMIN']), logIntervention);
router.put('/interventions/:interventionId', authorizeRoles(['MENTOR', 'ADMIN']), updateInterventionStatus);

export default router;
