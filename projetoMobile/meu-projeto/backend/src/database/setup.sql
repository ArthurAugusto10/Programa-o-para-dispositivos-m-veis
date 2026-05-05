-- 1. Criação da Tabela de Usuários (Login e Perfis)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    documento VARCHAR(20) NOT NULL, -- RA para Alunos, CPF para outros
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('Adm', 'Professor', 'Aluno')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criação da Tabela de Professores
CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    especialidade VARCHAR(100),
    data_admissao DATE DEFAULT CURRENT_DATE
);

-- 3. Criação da Tabela de Disciplinas (Materiais)
CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL
);

-- 4. Criação da Tabela de Alunos (Versão Simplificada sem ViaCEP)
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inserção/Atualização do Usuário Administrador
INSERT INTO usuarios (nome, email, documento, senha, perfil)
VALUES (
    'Arthur Admin', 
    'adm@fatec.sp.gov.br', 
    '123456', 
    'fatec123', 
    'Adm'
)
ON CONFLICT (email) DO UPDATE 
SET documento = EXCLUDED.documento, senha = EXCLUDED.senha;