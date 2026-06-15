import { Request, Response } from 'express';
import { pool } from '../database';

class CursoController {
    
    // 🎯 Listar cursos trazendo o nome do coordenador associado
    async getAll(req: Request, res: Response) {
        try {
            const queryText = `
                SELECT 
                    c.id, 
                    c.nome, 
                    c.area, 
                    c.duracao,
                    c.coordenador_id,
                    p.nome AS coordenador_nome
                FROM cursos c
                LEFT JOIN professores p ON c.coordenador_id = p.id
                ORDER BY c.nome ASC;
            `;
            const result = await pool.query(queryText);
            return res.status(200).json(result.rows);
        } catch (error: any) {
            console.error("Erro ao listar cursos:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 Cadastrar novo curso com coordenador
    async create(req: Request, res: Response) {
        const { nome, area, duracao, coordenador_id } = req.body;

        if (!nome || !area || !duracao) {
            return res.status(400).json({ error: "Nome, área e duração são obrigatórios." });
        }

        try {
            const queryText = `
                INSERT INTO cursos (nome, area, duracao, coordenador_id) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *;
            `;
            const values = [nome, area, Number(duracao), coordenador_id ? Number(coordenador_id) : null];
            const result = await pool.query(queryText, values);
            return res.status(201).json({ message: "Curso cadastrado!", data: result.rows[0] });
        } catch (error: any) {
            console.error("Erro ao cadastrar curso:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 Atualizar curso existente (incluindo alteração de coordenador)
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, area, duracao, coordenador_id } = req.body;

        try {
            const queryText = `
                UPDATE cursos 
                SET nome = $1, area = $2, duracao = $3, coordenador_id = $4 
                WHERE id = $5 
                RETURNING *;
            `;
            const values = [nome, area, Number(duracao), coordenador_id ? Number(coordenador_id) : null, Number(id)];
            const result = await pool.query(queryText, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }

            return res.status(200).json({ message: "Curso atualizado!", data: result.rows[0] });
        } catch (error: any) {
            console.error("Erro ao atualizar curso:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 Excluir curso
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const queryText = 'DELETE FROM cursos WHERE id = $1 RETURNING *;';
            const result = await pool.query(queryText, [Number(id)]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Curso não encontrado." });
            }
            return res.status(200).json({ message: "Curso removido com sucesso!" });
        } catch (error: any) {
            console.error("Erro ao deletar curso:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }
}

export default new CursoController();