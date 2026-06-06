-- 1. Criação da Tabela de Usuários (Login e Perfis Globais)
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

-- 3. Criação da Tabela de Disciplinas (Matérias)
CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL
);

-- 4. Criação da Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da Tabela de Matrículas (Vínculo de N para N entre Alunos e Disciplinas)
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Impede que o mesmo aluno seja matriculado duas vezes na mesma matéria
    CONSTRAINT unica_matricula UNIQUE (aluno_id, disciplina_id)
);

-- 5. Criação da Tabela de Notas (Com a restrição UNIQUE para o Upsert)
CREATE TABLE IF NOT EXISTS notas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
    nota1 NUMERIC(4,2) DEFAULT 0.0,
    nota2 NUMERIC(4,2) DEFAULT 0.0,
    faltas INTEGER DEFAULT 0,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unico_aluno_disciplina UNIQUE (aluno_id, disciplina_id)
);

-- =========================================================================
-- 🎯 CARGA DE DADOS INICIAIS (SEEDERS) PARA TESTES OFICIAIS
-- =========================================================================

-- Insere o Administrador
INSERT INTO usuarios (nome, email, documento, senha, perfil)
VALUES ('Arthur Admin', 'adm@fatec.sp.gov.br', '123456', 'fatec123', 'Adm')
ON CONFLICT (email) DO UPDATE SET documento = EXCLUDED.documento, senha = EXCLUDED.senha;

-- Insere o Professor Silvano (Na tabela de login e na de professores)
INSERT INTO usuarios (nome, email, documento, senha, perfil)
VALUES ('Silvano', 'silvano@techal.com', '019283', 'silvano123', 'Professor')
ON CONFLICT (email) DO TEXT;

INSERT INTO professores (nome, email, especialidade)
VALUES ('Silvano', 'silvano@techal.com', 'Internet das Coisas')
ON CONFLICT (email) DO NOTHING;

-- Insere os outros professores que apareceram na listagem da tela MinhaGrade
INSERT INTO professores (nome, email, especialidade) VALUES 
('Roberto Silva', 'Roberto@fatec.sp.gov.br', 'Engenharia de Software'),
('Silva', 'Silva@fatec.sp.gov.br', 'Banco de Dados Relacional')
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (nome, email, documento, senha, perfil) VALUES 
('Roberto Silva', 'Roberto@fatec.sp.gov.br', '555444', 'senha123', 'Professor'),
('Silva', 'Silva@fatec.sp.gov.br', '333222', 'senha123', 'Professor')
ON CONFLICT (email) DO NOTHING;

-- Insere o Aluno Alan (Na tabela de login e na de alunos)
INSERT INTO usuarios (nome, email, documento, senha, perfil)
VALUES ('alan', 'alan@fatec.sp.gov.br', '789654', 'alan123', 'Aluno')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alunos (nome, ra, email, cidade)
VALUES ('alan', '789654', 'alan@fatec.sp.gov.br', 'Jacareí')
ON CONFLICT (email) DO NOTHING;

-- Cria a disciplina de IOT vinculada ao Silvano (Buscando o ID dele dinamicamente)
INSERT INTO disciplinas (nome, carga_horaria, professor_id)
VALUES ('Internet das coisas (IOT)', 80, (SELECT id FROM professores WHERE email = 'silvano@techal.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Lança a nota inicial do Alan em IOT (Puxando os IDs dinamicamente)
INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, faltas)
VALUES (
    (SELECT id FROM alunos WHERE email = 'alan@fatec.sp.gov.br' LIMIT 1),
    (SELECT id FROM disciplinas WHERE nome = 'Internet das coisas (IOT)' LIMIT 1),
    10.0,
    7.0,
    6
)
ON CONFLICT ON CONSTRAINT unico_aluno_disciplina DO NOTHING;