import type { Request, Response } from 'express';
import { query } from '../database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
    async login(req: Request, res: Response) {
        const { email, senha, documento } = req.body; // Recebendo o documento do front

        try {
            const result = await query('SELECT * FROM usuarios WHERE email = $1', [email]);
            const usuario = result.rows[0];

            if (!usuario) {
                console.log("❌ Usuário não encontrado no banco.");
                return res.status(401).json({ error: 'E-mail inválido.' });
            }

            
            if (usuario.documento != documento) {
                console.log(`❌ Documento não bate. Banco: ${usuario.documento} | Enviado: ${documento}`);
                return res.status(401).json({ error: 'Documento inválido.' });
            }

        
            console.log("✅ Email e Doc OK. Verificando senha...");



            if (usuario.senha !== senha) { 
                console.log("❌ Senha incorreta.");
                return res.status(401).json({ error: 'Senha incorreta.' });
            }

            
            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil },
                process.env.JWT_SECRET || 'scholar_secret',
                { expiresIn: '1d' }
            );

            
            return res.json({
                token,
                usuario: {
                    nome: usuario.nome,
                    perfil: usuario.perfil
                }
            });

        } catch (err) {
            return res.status(500).json({ error: 'Erro no servidor durante o login.' });
        }
    }
}

export default new AuthController();