import { Router } from 'express';
import {
  getMyHostelDetails,
  getAllHostelRooms,
} from '../controllers/hostel.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/my-room', getMyHostelDetails);
router.get('/rooms', authorizeRoles(['ADMIN']), getAllHostelRooms);

export default router;
