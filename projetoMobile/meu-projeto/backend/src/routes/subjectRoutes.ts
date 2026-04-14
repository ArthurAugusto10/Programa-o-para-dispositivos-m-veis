import { Router } from 'express';
import SubjectController from '../controllers/SubjectController';

const router = Router();

// Endpoint para Cadastro de Disciplinas [cite: 99, 100]
router.post('/disciplinas', SubjectController.create);

// Endpoint para Listagem Completa
router.get('/disciplinas', SubjectController.listAll);

export default router;