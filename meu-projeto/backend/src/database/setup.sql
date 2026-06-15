-- =========================================================================
-- 🛠️ 1. CRIAÇÃO DAS TABELAS (ESTRUTURA COMPLETA)
-- =========================================================================

-- Tabela de Usuários (Login e Perfis Globais)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    documento VARCHAR(20) NOT NULL, -- RA para Alunos, CPF para outros
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('Adm', 'Professor', 'Aluno')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    especialidade VARCHAR(100),
    data_admissao DATE DEFAULT CURRENT_DATE
);

-- Tabela de Cursos (Módulo Complementar - Requisito Prof. André)
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    area VARCHAR(100) NOT NULL, -- Ex: Tecnologia, Gestão, Exatas
    duracao INT NOT NULL,       -- Duração em semestres
    coordenador_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Disciplinas (Matérias)
CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    area VARCHAR(100) DEFAULT 'Tecnologia',
    professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL
);

-- Tabela de Alunos (Atualizada com a Chave Estrangeira do Curso)
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(100),
    curso_id INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Matrículas (Vínculo N para N entre Alunos e Disciplinas)
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE CASCADE,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unica_matricula UNIQUE (aluno_id, disciplina_id)
);

-- Tabela de Notas (Com suporte a Upsert via ON CONFLICT)
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
-- 🎯 2. CARGA DE DADOS INICIAIS (SEEDERS COMPLETO)
-- =========================================================================

-- 🔑 ADMS
INSERT INTO usuarios (nome, email, documento, senha, perfil)
VALUES ('Arthur Admin', 'adm@fatec.sp.gov.br', '123456', 'fatec123', 'Adm')
ON CONFLICT (email) DO UPDATE SET documento = EXCLUDED.documento, senha = EXCLUDED.senha;

-- 👨‍🏫 PROFESSORES
INSERT INTO usuarios (nome, email, documento, senha, perfil) VALUES 
('Silvano', 'silvano@techal.com', '019283', 'silvano123', 'Professor'),
('Roberto Silva', 'Roberto@fatec.sp.gov.br', '555444', 'senha123', 'Professor'),
('Silva', 'Silva@fatec.sp.gov.br', '333222', 'senha123', 'Professor'),
('Fausto Silva', 'Fausto@fatec.sp.gov.br', '777888', 'senha123', 'Professor')
ON CONFLICT (email) DO NOTHING;

INSERT INTO professores (nome, email, especialidade) VALUES 
('Silvano', 'silvano@techal.com', 'Internet das Coisas'),
('Roberto Silva', 'Roberto@fatec.sp.gov.br', 'Engenharia de Software'),
('Silva', 'Silva@fatec.sp.gov.br', 'Banco de Dados Relacional'),
('Fausto Silva', 'Fausto@fatec.sp.gov.br', 'Administração Geral')
ON CONFLICT (email) DO NOTHING;

-- 🎓 CURSOS OFICIAIS (Atribuindo Coordenadores)
INSERT INTO cursos (nome, area, duracao, coordenador_id) VALUES 
(
    'Desenvolvimento de Software Multiplataforma', 
    'Tecnologia', 
    6, 
    (SELECT id FROM professores WHERE email = 'silvano@techal.com' LIMIT 1)
),
(
    'Logística', 
    'Gestão', 
    6, 
    (SELECT id FROM professores WHERE email = 'Fausto@fatec.sp.gov.br' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- 👨‍🎓 ALUNOS (Garantindo e-mails estritamente minúsculos para evitar bugs de login)
INSERT INTO usuarios (nome, email, documento, senha, perfil) VALUES 
('Alan', 'alan@fatec.sp.gov.br', '789654', 'alan123', 'Aluno'),
('Igor', 'igor@fatec.sp.gov.br', '123045', 'igor123', 'Aluno')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alunos (nome, ra, email, cidade, curso_id) VALUES 
(
    'Alan', '789654', 'alan@fatec.sp.gov.br', 'Jacareí',
    (SELECT id FROM cursos WHERE nome LIKE '%Desenvolvimento%' LIMIT 1)
),
(
    'Igor', '123045', 'igor@fatec.sp.gov.br', 'Jacareí',
    (SELECT id FROM cursos WHERE nome LIKE '%Desenvolvimento%' LIMIT 1)
)
ON CONFLICT (email) DO NOTHING;

-- 📚 DISCIPLINAS
INSERT INTO disciplinas (nome, carga_horaria, area, professor_id) VALUES 
(
    'Internet das coisas (IOT)', 80, 'Tecnologia', 
    (SELECT id FROM professores WHERE email = 'silvano@techal.com' LIMIT 1)
),
(
    'ADM', 40, 'Gestão', 
    (SELECT id FROM professores WHERE email = 'Fausto@fatec.sp.gov.br' LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- 🔗 MATRÍCULAS EFETIVAS
INSERT INTO matriculas (aluno_id, disciplina_id) VALUES 
(
    (SELECT id FROM alunos WHERE email = 'alan@fatec.sp.gov.br' LIMIT 1),
    (SELECT id FROM disciplinas WHERE nome = 'Internet das coisas (IOT)' LIMIT 1)
),
(
    (SELECT id FROM alunos WHERE email = 'igor@fatec.sp.gov.br' LIMIT 1),
    (SELECT id FROM disciplinas WHERE nome = 'ADM' LIMIT 1)
)
ON CONFLICT ON CONSTRAINT unica_matricula DO NOTHING;

-- 📊 NOTAS LANÇADAS
INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, faltas) VALUES 
(
    (SELECT id FROM alunos WHERE email = 'alan@fatec.sp.gov.br' LIMIT 1),
    (SELECT id FROM disciplinas WHERE nome = 'Internet das coisas (IOT)' LIMIT 1),
    10.0, 7.0, 6
),
(
    (SELECT id FROM alunos WHERE email = 'igor@fatec.sp.gov.br' LIMIT 1),
    (SELECT id FROM disciplinas WHERE nome = 'ADM' LIMIT 1),
    10.0, 6.0, 0
)
ON CONFLICT ON CONSTRAINT unico_aluno_disciplina DO NOTHING;