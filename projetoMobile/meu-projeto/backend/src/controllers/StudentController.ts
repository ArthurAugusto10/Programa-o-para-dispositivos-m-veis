import { Request, Response } from 'express';
import { query } from '../database/index'; // Import da sua conexão com o banco

class StudentController {
    create(arg0: string, create: any) {
        throw new Error('Method not implemented.');
    }
    getReportCard // 2. Verificar se o e-mail ou RA já existem para evitar duplicidade
        (arg0: string, getReportCard: any) {
            throw new Error('Method not implemented.');
    }
    async store(req: Request, res: Response) {
        const { nome, email, ra, senha, cidade } = req.body;

        // 1. Validação de campos obrigatórios
        if (!nome || !email || !ra || !senha) {
            return res.status(400).json({ error: 'Nome, E-mail, RA e Senha são obrigatórios.' });
        }

        try {
            // 2. Verificar se o e-mail ou RA já existem para evitar duplicidade
            const userExists = await query('SELECT id FROM usuarios WHERE email = $1 OR documento = $2', [email, ra]);
            
            if (userExists.rows.length > 0) {
                return res.status(400).json({ error: 'E-mail ou RA já cadastrado no sistema.' });
            }

            // 3. Inserir na tabela de USUARIOS (para permitir o login)
            // Note que usamos o RA no campo 'documento'
            await query(
                'INSERT INTO usuarios (nome, email, documento, senha, perfil) VALUES ($1, $2, $3, $4, $5)',
                [nome, email, ra, senha, 'Aluno']
            );

            // 4. Inserir na tabela de ALUNOS (dados específicos/acadêmicos)
            await query(
                'INSERT INTO alunos (nome, ra, email, cidade) VALUES ($1, $2, $3, $4)',
                [nome, ra, email, cidade || null]
            );

            // Se tudo der certo
            return res.status(201).json({ message: 'Aluno e credenciais registrados com sucesso!' });

        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            return res.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
        }
    }

    // Você também pode adicionar o método para listar os alunos cadastrados
    async index(req: Request, res: Response) {
        try {
            const result = await query('SELECT id, nome, ra, email, cidade FROM alunos ORDER BY nome ASC');
            return res.json(result.rows);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar alunos.' });
        }
    }
}

export default new StudentController();