import { Router } from 'express';
import {
  getMaterials,
  uploadMaterial,
  downloadMaterial,
} from '../controllers/material.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getMaterials);
router.post('/', authorizeRoles(['FACULTY', 'ADMIN']), uploadMaterial);
router.get('/:materialId/download', downloadMaterial);

export default router;
