import { Request, Response } from 'express';
import { pool } from '../database';

class TeacherController {

  // 1. Cadastrar Professor (Com transação e login inclusos)
  async create(req: Request, res: Response) {
    const { nome, email, especialidade, senha, documento } = req.body;

    if (!nome || !email || !senha || !documento) {
      return res.status(400).json({ error: "Nome, E-mail, Senha e Documento são obrigatórios." });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Inserir na tabela de USUÁRIOS (Passando o documento digitado pelo Admin)
        const queryUsuario = `
            INSERT INTO usuarios (nome, email, documento, senha, perfil)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        // $3 agora recebe a variável documento limpa
        const valoresUsuario = [nome, email, documento, senha, 'Professor']; 
        await client.query(queryUsuario, valoresUsuario);

        // 2. Inserir na tabela de PROFESSORES
        const queryProfessor = `
            INSERT INTO professores (nome, email, especialidade)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email, especialidade, data_admissao;
        `;
        const valoresProfessor = [nome, email, especialidade || null];
        const resultProfessor = await client.query(queryProfessor, valoresProfessor);
        
        const novoProfessor = resultProfessor.rows[0];

        await client.query('COMMIT');
        return res.status(201).json(novoProfessor);

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error("Erro na transação de cadastro de professor:", error);

        if (error.code === '23505') {
            return res.status(400).json({ error: "Este E-mail ou Documento já está cadastrado." });
        }
        return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
    } finally {
        client.release();
    }
  }

  // 2. Listar Professores (Adicionado o método correto para a rota GET usar!)
  async index(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT id, nome, email, especialidade, data_admissao FROM professores ORDER BY nome ASC'
      );
      return res.json(result.rows);
    } catch (error: any) {
      console.error("Erro ao buscar professores:", error);
      return res.status(500).json({ error: 'Erro ao buscar professores.' });
    }
  }


  // Adicione este método dentro da classe TeacherController, antes do fechamento }
async getClasses(req: Request, res: Response) {
    const { email } = req.params; // Recebe o e-mail do professor logado pela URL

    try {
        // Busca as disciplinas cruzando a tabela de disciplinas com o e-mail do professor
        const queryText = `
            SELECT d.id, d.nome, d.carga_horaria 
            FROM disciplinas d
            JOIN professores p ON d.professor_id = p.id
            WHERE p.email = $1
            ORDER BY d.nome ASC
        `;
        
        const result = await pool.query(queryText, [email]);
        return res.json(result.rows);

    } catch (error: any) {
        console.error("Erro ao buscar disciplinas do professor:", error);
        return res.status(500).json({ error: `Erro no Banco: ${error.message}` });
    }
}
}

export default new TeacherController();