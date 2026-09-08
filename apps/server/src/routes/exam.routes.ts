import { Router } from 'express';
import {
  getExamSchedule,
  createExam,
  getExamGrades,
  submitExamGrades,
  getMyReportCard,
} from '../controllers/exam.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/schedule', getExamSchedule);
router.post('/', authorizeRoles(['ADMIN', 'FACULTY']), createExam);
router.get('/:examId/grades', getExamGrades);
router.post('/:examId/grades', authorizeRoles(['FACULTY', 'ADMIN']), submitExamGrades);
router.get('/report-card', getMyReportCard);

export default router;
