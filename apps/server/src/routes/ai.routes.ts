import { Router } from 'express';
import {
  getStudentRiskPrediction,
  askGeminiAdvisor,
} from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/predict-risk/:studentId?', getStudentRiskPrediction);
router.post('/advisor', askGeminiAdvisor);

export default router;
