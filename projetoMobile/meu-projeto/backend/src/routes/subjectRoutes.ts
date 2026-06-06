import { Router } from 'express';
import SubjectController from '../controllers/SubjectController';

const router = Router();

router.post('/disciplinas', SubjectController.create);
router.get('/disciplinas', SubjectController.index);

export default router;