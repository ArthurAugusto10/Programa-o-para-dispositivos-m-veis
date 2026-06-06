import { Router } from 'express';
import TeacherController from '../controllers/TeacherController';

const router = Router();


router.post('/professores', TeacherController.create);
router.get('/professores', TeacherController.index); 
router.get('/professores/:email/disciplinas', TeacherController.getClasses);

export default router;