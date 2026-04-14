import { Router } from 'express';
import TeacherController from '../controllers/TeacherController';

const router = Router();

// Endpoint para Cadastro de Professores 
router.post('/professores', TeacherController.create);

// Endpoint opcional para listagem
router.get('/professores', TeacherController.list);

export default router;