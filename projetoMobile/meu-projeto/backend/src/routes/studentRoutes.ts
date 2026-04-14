import { Router } from 'express';
import StudentController from '../controllers/StudentController';

const router = Router();

/**
 * Rota para cadastrar um novo aluno
 * POST /api/alunos
 * Conforme definido na API 2 do projeto
 */
router.post('/alunos', StudentController.create);

/**
 * Rota para consulta de boletim por matrícula
 * GET /api/boletim/:matricula
 * Conforme definido na API 3 do projeto
 */
router.get('/boletim/:matricula', StudentController.getReportCard);

export default router;