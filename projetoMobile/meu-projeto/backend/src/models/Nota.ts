export interface Nota {
    id?: number;
    aluno_id: number;
    disciplina_id: number;
    nota1: number;
    nota2: number;
    media: number;
    situacao: 'Aprovado' | 'Reprovado';
}