import { Request, Response } from 'express';
import { query } from '../database';
import { Disciplina } from '../models/Disciplina';

class SubjectController {
  // Rota POST /api/disciplinas [cite: 99]
  async create(req: Request, res: Response) {
    const { 
      nome, 
      carga_horaria, 
      professor_id, 
      curso, 
      semestre 
    }: Disciplina = req.body;

    // Validação de campos obrigatórios [cite: 60-64]
    if (!nome || !carga_horaria || !professor_id || !curso || !semestre) {
      return res.status(400).json({ error: 'Todos os campos da disciplina são obrigatórios.' });
    }

    try {
      // Verifica se o professor informado existe no banco antes de cadastrar a disciplina
      const teacherCheck = await query('SELECT id FROM professores WHERE id = $1', [professor_id]);
      
      if (teacherCheck.rowCount === 0) {
        return res.status(404).json({ error: 'O professor informado não existe.' });
      }

      const sql = `
        INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      
      const values = [nome, carga_horaria, professor_id, curso, semestre];
      const result = await query(sql, values);

      return res.status(201).json({ 
        message: 'Disciplina vinculada e cadastrada com sucesso!', 
        disciplina: result.rows[0] 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao cadastrar disciplina no sistema.' });
    }
  }

  // Lista disciplinas trazendo o nome do professor (JOIN)
  async listAll(req: Request, res: Response) {
    try {
      const sql = `
        SELECT d.*, p.nome as nome_professor 
        FROM disciplinas d
        INNER JOIN professores p ON p.id = d.professor_id
        ORDER BY d.nome ASC`;
      
      const result = await query(sql);
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar disciplinas.' });
    }
  }
}

export default new SubjectController();