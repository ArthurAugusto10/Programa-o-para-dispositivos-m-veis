import { Request, Response } from 'express';
import { pool } from '../database';

class SubjectController {
    // 1. Cadastrar Disciplina
    async create(req: Request, res: Response) {
        const { nome, carga_horaria, professor_id } = req.body;

        // Validação dos campos obrigatórios conforme o setup.sql
        if (!nome || !carga_horaria) {
            return res.status(400).json({ error: "Nome e Carga Horária são obrigatórios." });
        }

        try {
            const queryText = `
                INSERT INTO disciplinas (nome, carga_horaria, professor_id)
                VALUES ($1, $2, $3)
                RETURNING id, nome, carga_horaria, professor_id;
            `;
            // Se nenhum professor for selecionado, passa null (já que a tabela aceita NULL)
            const values = [nome, Number(carga_horaria), professor_id || null];
            
            const result = await pool.query(queryText, values);
            return res.status(201).json(result.rows[0]);

        } catch (error: any) {
            console.error("Erro ao cadastrar disciplina:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 2. Listar Disciplinas (Trazendo o nome do professor acoplado)
    async index(req: Request, res: Response) {
        try {
            const queryText = `
                SELECT d.id, d.nome, d.carga_horaria, p.nome AS professor_nome 
                FROM disciplinas d
                LEFT JOIN professores p ON d.professor_id = p.id
                ORDER BY d.nome ASC
            `;
            const result = await pool.query(queryText);
            return res.json(result.rows);
        } catch (error: any) {
            console.error("Erro ao buscar disciplinas:", error);
            return res.status(500).json({ error: 'Erro ao buscar disciplinas.' });
        }
    }
}

export default new SubjectController();