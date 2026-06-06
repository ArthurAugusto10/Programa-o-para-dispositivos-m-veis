import { Router } from 'express';
import StudentController from '../controllers/StudentController';

const router = Router();

router.post('/alunos', StudentController.create); // Garanta que aponta para 'create' ou 'store'
router.get('/alunos', StudentController.index);   // 👈 Linha 18: Deve apontar exatamente para .index

export default router;