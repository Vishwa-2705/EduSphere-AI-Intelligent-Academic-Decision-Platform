import { Router } from 'express';
import { getDepartments, getCourses } from '../controllers/academic.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/departments', authenticate, getDepartments);
router.get('/courses', authenticate, getCourses);

export default router;
