import { Request, Response } from 'express';
import { pool } from '../database';

class GradeController {
    // 🎯 1. Lançar ou Atualizar Nota (Upsert)
    async launch(req: Request, res: Response) {
        const { aluno_id, disciplina_id, nota1, nota2, faltas } = req.body;

        if (!aluno_id || !disciplina_id) {
            return res.status(400).json({ error: "Aluno e Disciplina são obrigatórios." });
        }

        try {
            const queryText = `
                INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, faltas)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (aluno_id, disciplina_id) 
                DO UPDATE SET 
                    nota1 = EXCLUDED.nota1, 
                    nota2 = EXCLUDED.nota2, 
                    faltas = EXCLUDED.faltas,
                    data_registro = CURRENT_TIMESTAMP
                RETURNING *;
            `;

            const values = [
                Number(aluno_id),
                Number(disciplina_id),
                Number(nota1 || 0),
                Number(nota2 || 0),
                Number(faltas || 0)
            ];

            const result = await pool.query(queryText, values);
            return res.status(200).json({ message: "Nota lançada com sucesso!", data: result.rows[0] });

        } catch (error: any) {
            console.error("Erro ao lançar nota:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 2. Buscar Notas de uma Disciplina (Para a pauta do professor)
    // 🎯 Buscar APENAS os alunos matriculados na disciplina (Para a pauta do professor)
async getBySubject(req: Request, res: Response) {
    const { disciplina_id } = req.params;
    const idDisciplinaNum = parseInt(disciplina_id, 10);

    if (isNaN(idDisciplinaNum)) {
        return res.status(400).json({ error: "ID da disciplina inválido." });
    }

    try {
        const queryText = `
            SELECT 
                a.id AS aluno_id, 
                a.nome AS aluno_nome, 
                a.ra AS aluno_ra,
                COALESCE(n.nota1, 0.0) AS nota1, 
                COALESCE(n.nota2, 0.0) AS nota2, 
                COALESCE(n.faltas, 0) AS faltas
            FROM matriculas m
            JOIN alunos a ON m.aluno_id = a.id
            LEFT JOIN notas n ON a.id = n.aluno_id AND n.disciplina_id = m.disciplina_id
            WHERE m.disciplina_id = $1
            ORDER BY a.nome ASC;
        `;
        
        const result = await pool.query(queryText, [idDisciplinaNum]);
        return res.json(result.rows);
        
    } catch (error: any) {
        console.error("Erro ao buscar notas por disciplina:", error);
        return res.status(500).json({ error: "Erro ao buscar dados de notas do banco." });
    }
}

    // 🎯 3. Buscar o Boletim Completo do Aluno usando o e-mail dele
    async getStudentReport(req: Request, res: Response) {
        const { email } = req.params;

        try {
            const queryText = `
                SELECT 
                    d.nome AS disciplina_nome,
                    d.carga_horaria,
                    COALESCE(n.nota1, 0.0) AS nota1,
                    COALESCE(n.nota2, 0.0) AS nota2,
                    COALESCE(n.faltas, 0) AS faltas
                FROM alunos a
                JOIN notas n ON a.id = n.aluno_id
                JOIN disciplinas d ON n.disciplina_id = d.id
                WHERE a.email = $1
                ORDER BY d.nome ASC;
            `;

            const result = await pool.query(queryText, [email]);
            return res.json(result.rows);

        } catch (error: any) {
            console.error("Erro ao buscar boletim do aluno:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 Buscar todos os professores cadastrados no sistema
    // 🎯 Buscar todos os professores cadastrados no sistema (Query simplificada e segura)
    // 🎯 Buscar professores trazendo a matéria correlacionada ao Aluno logado
    async getAllTeachers(req: Request, res: Response) {
        const { emailAluno } = req.params; // Pegamos o e-mail do aluno logado para fazer o cruzamento

        try {
            const queryText = `
            SELECT 
                p.id, 
                p.nome, 
                p.email,
                d.nome AS disciplina_nome,
                -- Verifica se este professor dá aula para o aluno específico
                EXISTS (
                    SELECT 1 FROM notas n
                    JOIN alunos a ON n.aluno_id = a.id
                    WHERE n.disciplina_id = d.id AND a.email = $1
                ) AS da_aula_para_mim
            FROM professores p
            LEFT JOIN disciplinas d ON p.id = d.professor_id
            ORDER BY p.nome ASC;
        `;

            const result = await pool.query(queryText, [emailAluno]);
            return res.json(result.rows);

        } catch (error: any) {
            console.error("Erro detalhado ao buscar professores com disciplinas:", error);
            return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
        }
    }

    // 🎯 Buscar as disciplinas em que o aluno específico está matriculado/tem vínculo
    // 🎯 Buscar as disciplinas do aluno trazendo o nome do respectivo professor
    // 🎯 Buscar as disciplinas que o aluno está MATRICULADO (Mesmo sem notas lançadas)
async getStudentSubjects(req: Request, res: Response) {
    const { email } = req.params;
    try {
        const queryText = `
            SELECT DISTINCT 
                d.id, 
                d.nome AS disciplina_nome, 
                d.carga_horaria,
                p.nome AS professor_nome
            FROM matriculas m
            JOIN alunos a ON m.aluno_id = a.id
            JOIN disciplinas d ON m.disciplina_id = d.id
            LEFT JOIN professores p ON (d.professor_id = p.id OR d.id_professor = p.id)
            WHERE a.email = $1
            ORDER BY d.nome ASC;
        `;
        const result = await pool.query(queryText, [email]);
        return res.json(result.rows);
    } catch (error: any) {
        console.error("Erro ao buscar disciplinas do aluno:", error);
        return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
    }
}

// 🎯 4. Realizar a Matrícula de um Aluno em uma Disciplina (Exclusivo do Adm)
async registerEnrollment(req: Request, res: Response) {
    const { aluno_id, disciplina_id } = req.body;

    if (!aluno_id || !disciplina_id) {
        return res.status(400).json({ error: "Aluno e Disciplina são obrigatórios." });
    }

    try {
        const queryText = `
            INSERT INTO matriculas (aluno_id, disciplina_id)
            VALUES ($1, $2)
            ON CONFLICT (aluno_id, disciplina_id) DO NOTHING
            RETURNING *;
        `;

        const result = await pool.query(queryText, [Number(aluno_id), Number(disciplina_id)]);

        if (result.rowCount === 0) {
            return res.status(400).json({ error: "Este aluno já está matriculado nesta disciplina." });
        }

        return res.status(201).json({ message: "Matrícula realizada com sucesso!", data: result.rows[0] });

    } catch (error: any) {
        console.error("Erro ao realizar matrícula:", error);
        return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
    }
}

}

export default new GradeController();