export interface Disciplina {
    id?: number;
    nome: string;
    carga_horaria: string;
    professor_id: number; // Chave estrangeira
    curso: string;
    semestre: string;
}