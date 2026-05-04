import type { Request, Response } from 'express';
import { query } from '../database';
import type { Professor } from '../models/Professor';

class TeacherController {
  // Rota POST /api/professores
  async create(req: Request, res: Response) {
    const { nome, titulacao, area, tempo_docencia, email }: Professor = req.body;

    // Validação de campos obrigatórios conforme o modelo [cite: 53-57]
    if (!nome || !email || !area) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes (nome, área ou email).' });
    }

    try {
      const sql = `
        INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      
      const values = [nome, titulacao, area, tempo_docencia, email];
      const result = await query(sql, values);

      return res.status(201).json({ 
        message: 'Professor cadastrado com sucesso!', 
        professor: result.rows[0] 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar professor no banco de dados.' });
    }
  }

  // Método para listar professores (útil para preencher o Select de disciplinas depois)
  async list(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM professores ORDER BY nome ASC');
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar professores.' });
    }
  }
}

export default new TeacherController();