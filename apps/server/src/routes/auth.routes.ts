import { Router } from 'express';
import { login, getMe, refreshToken, logout, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/change-password', authenticate, changePassword);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
