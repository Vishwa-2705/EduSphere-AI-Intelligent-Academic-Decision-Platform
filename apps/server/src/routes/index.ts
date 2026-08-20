import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import academicRoutes from './academic.routes';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'EduSphere AI Backend Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/academics', academicRoutes);

export default router;
