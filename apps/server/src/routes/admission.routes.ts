import { Router } from 'express';
import {
  getAdmissionApplications,
  updateApplicationStatus,
  provisionStudentFromAdmission,
} from '../controllers/admission.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/applications', authorizeRoles(['ADMIN']), getAdmissionApplications);
router.put('/applications/:applicationId', authorizeRoles(['ADMIN']), updateApplicationStatus);
router.post('/applications/:applicationId/provision', authorizeRoles(['ADMIN']), provisionStudentFromAdmission);

export default router;
