import { Router } from 'express';
import {
  getMyAttendance,
  getCourseAttendance,
  createAttendanceSession,
  getAttendanceAlerts,
} from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/my-record', getMyAttendance);
router.get('/course/:courseId', getCourseAttendance);
router.post('/sessions', authorizeRoles(['FACULTY', 'ADMIN']), createAttendanceSession);
router.get('/alerts', getAttendanceAlerts);

export default router;
