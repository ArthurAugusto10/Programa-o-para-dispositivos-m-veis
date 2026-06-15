import { Router } from 'express';
import GradeController from '../controllers/GradeController';

const router = Router();

router.post('/notas', GradeController.launch);
router.get('/notas/disciplina/:disciplina_id', GradeController.getBySubject);
router.get('/boletim/:email', GradeController.getStudentReport);
router.get('/aluno/professores', GradeController.getAllTeachers);
router.get('/aluno/disciplinas/:email', GradeController.getStudentSubjects);
router.get('/aluno/professores/:emailAluno', GradeController.getAllTeachers);
router.post('/aluno/matricular', GradeController.registerEnrollment);

export default router;