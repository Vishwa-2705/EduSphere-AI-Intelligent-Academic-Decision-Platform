import { Router } from 'express';
import {
  getStudentTimetable,
  getFacultyTimetable,
  createTimetableSlot,
  runOptimizationSolver,
} from '../controllers/timetable.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/student', getStudentTimetable);
router.get('/faculty', getFacultyTimetable);
router.post('/slots', authorizeRoles(['ADMIN']), createTimetableSlot);
router.post('/optimize', authorizeRoles(['ADMIN']), runOptimizationSolver);

export default router;
