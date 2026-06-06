import { Request, Response } from 'express';
import { pool } from '../database';

class StudentController {
    getReportCard(arg0: string, getReportCard: any) {
        throw new Error('Method not implemented.');
    }

    async create(req: Request, res: Response) {
        const { nome, email, ra, senha, cidade } = req.body;

        
        if (!nome || !email || !ra || !senha) {
            return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
        }

        
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            
            const queryUsuario = `
                INSERT INTO usuarios (nome, email, documento, senha, perfil)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            const valoresUsuario = [nome, email, ra, senha, 'Aluno'];
            await client.query(queryUsuario, valoresUsuario);

            
            const queryAluno = `
                INSERT INTO alunos (nome, ra, email, cidade)
                VALUES ($1, $2, $3, $4)
                RETURNING id, nome, ra, email, cidade;
            `;
            const valoresAluno = [nome, ra, email, cidade || null];
            const resultAluno = await client.query(queryAluno, valoresAluno);
            
            const novoAluno = resultAluno.rows[0];

            await client.query('COMMIT');
            return res.status(201).json(novoAluno);

        } catch (error: any) {
            await client.query('ROLLBACK');
            console.error("Erro na transação de cadastro:", error);

            if (error.code === '23505') {
                return res.status(400).json({ error: "RA ou E-mail já cadastrado no sistema." });
            }
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        } finally {
            client.release();
        }
    }

    async index(req: Request, res: Response) {
        try {
            
            const result = await pool.query('SELECT id, nome, ra, email, cidade FROM alunos ORDER BY nome ASC');
            return res.json(result.rows);
        } catch (error: any) {
            console.error("Erro ao buscar alunos:", error);
            return res.status(500).json({ error: 'Erro ao buscar alunos.' });
        }
    }
}

export default new StudentController();