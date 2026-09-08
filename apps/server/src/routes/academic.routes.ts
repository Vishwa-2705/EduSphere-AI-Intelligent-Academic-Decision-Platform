import { Router } from 'express';
import {
  getDepartments,
  createDepartment,
  getCourses,
  getCourseById,
  createCourse,
  getMyCourses,
} from '../controllers/academic.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/departments', getDepartments);
router.post('/departments', authorizeRoles(['ADMIN']), createDepartment);

router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseById);
router.post('/courses', authorizeRoles(['ADMIN']), createCourse);

router.get('/my-courses', getMyCourses);

export default router;
