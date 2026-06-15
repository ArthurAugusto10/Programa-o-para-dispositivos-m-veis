import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Força a senha a ser uma string
  port: Number(process.env.DB_PORT),
});
export const setupDatabase = async () => {
    try {
        // Busca o arquivo setup.sql na mesma pasta deste arquivo index.ts
        const sqlFilePath = path.join(__dirname, 'setup.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("⏳ Verificando estrutura do banco de dados...");
        await pool.query(sql);
        console.log("✅ Banco de dados pronto para uso.");
    } catch (error) {
        console.error("❌ Erro ao inicializar o banco de dados:", error);
        // Opcional: encerrar o processo se o banco não subir
        // process.exit(1); 
    }
};

export const query = (text: string, params?: any[]) => pool.query(text, params);