import { Router } from 'express';
import {
  getStudentDashboard,
  getFacultyDashboard,
  getMentorDashboard,
  getAdminDashboard,
} from '../controllers/dashboard.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

// Student dashboard: accessible by STUDENT and ADMIN
router.get('/student', authenticate, authorizeRoles('STUDENT', 'ADMIN'), getStudentDashboard);

// Faculty dashboard: accessible by FACULTY and ADMIN
router.get('/faculty', authenticate, authorizeRoles('FACULTY', 'ADMIN'), getFacultyDashboard);

// Mentor dashboard: accessible by MENTOR and ADMIN
router.get('/mentor', authenticate, authorizeRoles('MENTOR', 'ADMIN'), getMentorDashboard);

// Admin dashboard: accessible by ADMIN only
router.get('/admin', authenticate, authorizeRoles('ADMIN'), getAdminDashboard);

export default router;
