import type { Request, Response } from 'express';
import { query } from '../database';
import type { Aluno } from '../models/Aluno';

class StudentController {
 
  async create(req: Request, res: Response) {
    const { 
      nome, matricula, curso, email, telefone, cep, endereco, cidade, estado 
    }: Aluno = req.body;

    // Validação básica conforme campos obrigatórios 
    if (!nome || !matricula || !email) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    try {
      const sql = `
        INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
      
      const values = [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado];
      const result = await query(sql, values);

      return res.status(201).json({ 
        message: 'Aluno cadastrado com sucesso!', 
        aluno: result.rows[0] 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno ao salvar aluno.' });
    }
  }

  
  async getReportCard(req: Request, res: Response) {
    const { matricula } = req.params;
    // Lógica para buscar notas e médias será implementada aqui
  }
}

export default new StudentController();