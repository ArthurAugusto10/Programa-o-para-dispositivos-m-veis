import { Router } from 'express';
import CursoController from '../controllers/CursoController';

const router = Router();

// ... (Suas rotas de login, notas e matrículas continuam aqui em cima) ...

// 🎯 Correção definitiva dentro de CursoRoutes.ts:
router.get('/cursos', CursoController.getAll);       // Vira: /api/cursos
router.post('/cursos', CursoController.create);     // Vira: /api/cursos
router.put('/cursos/:id', CursoController.update);   // Vira: /api/cursos/:id
router.delete('/cursos/:id', CursoController.delete); // Vira: /api/cursos/:id

export default router;