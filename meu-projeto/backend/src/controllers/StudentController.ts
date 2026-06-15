import { Request, Response } from 'express';
import { pool } from '../database';

class StudentController {
    getReportCard(arg0: string, getReportCard: any) {
        throw new Error('Method not implemented.');
    }

    // 🎯 Requisito 6º: Criar aluno vinculando ao Curso (curso_id)
    async create(req: Request, res: Response) {
        // Capturando o curso_id que vem do Picker do Frontend
        const { nome, email, ra, senha, cidade, curso_id } = req.body;

        if (!nome || !email || !ra || !senha) {
            return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Grava credenciais de acesso na tabela global de usuários
            const queryUsuario = `
                INSERT INTO usuarios (nome, email, documento, senha, perfil)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            const valoresUsuario = [nome, email, ra, senha, 'Aluno'];
            await client.query(queryUsuario, valoresUsuario);

            // 2. Grava os dados do Aluno vinculando a chave estrangeira curso_id
            const queryAluno = `
                INSERT INTO alunos (nome, ra, email, cidade, curso_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, nome, ra, email, cidade, curso_id;
            `;
            // Se curso_id não for informado, grava NULL no banco perfeitamente
            const valoresAluno = [nome, ra, email, cidade || null, curso_id ? Number(curso_id) : null];
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

    // 🎯 Consulta Avançada: Lista alunos trazendo também o nome do curso vinculado (Se houver)
    async index(req: Request, res: Response) {
        try {
            const queryText = `
                SELECT 
                    a.id, 
                    a.nome, 
                    a.ra, 
                    a.email, 
                    a.cidade,
                    c.nome AS curso_nome
                FROM alunos a
                LEFT JOIN cursos c ON a.curso_id = c.id
                ORDER BY a.nome ASC;
            `;
            const result = await pool.query(queryText);
            return res.json(result.rows);
        } catch (error: any) {
            console.error("Erro ao buscar alunos:", error);
            return res.status(500).json({ error: 'Erro ao buscar alunos.' });
        }
    }
}

export default new StudentController();