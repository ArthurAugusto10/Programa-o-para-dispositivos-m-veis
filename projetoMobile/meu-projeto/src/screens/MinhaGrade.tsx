import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';

interface Professor {
    id: number;
    nome: string;
    email: string;
    disciplina_nome: string | null;
    da_aula_para_mim: boolean;
}

interface Disciplina {
    id: number;
    disciplina_nome: string;
    carga_horaria: number;
    professor_nome: string | null; // Novo campo vindo do backend
}

export default function MinhaGrade({ route }: any) {
    const { emailUsuario } = route.params || { emailUsuario: '' };
    
    const [abaAtiva, setAbaAtiva] = useState<'materias' | 'professores'>('materias');
    const [materias, setMaterias] = useState<Disciplina[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, [emailUsuario]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            // Enviando o e-mail do usuário logado também para a rota de professores
            const [resMaterias, resProfessores] = await Promise.all([
                api.get(`/aluno/disciplinas/${emailUsuario}`),
                api.get(`/aluno/professores/${emailUsuario}`)
            ]);
            
            setMaterias(resMaterias.data);
            setProfessores(resProfessores.data);
        } catch (error) {
            console.error("Erro ao carregar dados da grade/professores:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minha Grade & Corpo Docente</Text>

            <View style={styles.abasContainer}>
                <TouchableOpacity 
                    style={[styles.aba, abaAtiva === 'materias' && styles.abaAtiva]} 
                    onPress={() => setAbaAtiva('materias')}
                >
                    <Text style={[styles.abaText, abaAtiva === 'materias' && styles.abaTextAtiva]}>Minhas Matérias</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.aba, abaAtiva === 'professores' && styles.abaAtiva]} 
                    onPress={() => setAbaAtiva('professores')}
                >
                    <Text style={[styles.abaText, abaAtiva === 'professores' && styles.abaTextAtiva]}>Professores</Text>
                </TouchableOpacity>
            </View>

            {abaAtiva === 'materias' ? (
    <FlatList
        data={materias}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma matéria vinculada a você.</Text>}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>{item.disciplina_nome}</Text>
                    <Text style={styles.card}>{item.carga_horaria}h</Text>
                </View>
                
                {/* Exibição dinâmica do Professor daquela matéria */}
                <Text style={styles.cardProfessor}>
                    Prof(a): {item.professor_nome || "Sem professor atribuído"}
                </Text>
            </View>
        )}
    />
            ) : (
                <FlatList
                    data={professores}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum professor cadastrado.</Text>}
                    renderItem={({ item }) => {
                        // 🎯 Logica condicional para o texto da matéria solicitado por você:
                        let textoMateria = "";
                        if (!item.disciplina_nome) {
                            textoMateria = "Sem matéria vinculada no momento";
                        } else if (item.da_aula_para_mim) {
                            textoMateria = `Matéria: ${item.disciplina_nome}`;
                        } else {
                            textoMateria = "Ministra uma matéria na qual você não está cadastrado";
                        }

                        return (
                            <View style={[styles.card, { borderLeftColor: item.da_aula_para_mim ? '#7ED321' : '#ff9500' }]}>
                                <Text style={styles.cardTitle}>{item.nome}</Text>
                                
                                {/* Exibição da matéria dinâmica ou mensagem personalizada */}
                                <Text style={[styles.cardMateria, item.da_aula_para_mim ? styles.materiaAtiva : styles.materiaInativa]}>
                                    {textoMateria}
                                </Text>

                                <Text style={styles.cardSubtitle}>Contato: {item.email}</Text>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    abasContainer: { flexDirection: 'row', backgroundColor: '#1e1e1e', borderRadius: 8, padding: 4, marginBottom: 20 },
    aba: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
    abaAtiva: { backgroundColor: '#2d2d2d' },
    abaText: { color: '#aaa', fontWeight: 'bold', fontSize: 14 },
    abaTextAtiva: { color: '#7ED321' },
    emptyText: { color: '#aaa', textAlign: 'center', fontSize: 16, marginTop: 40 },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cardMateria: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    materiaAtiva: { color: '#7ED321' }, // Verde para professores do aluno
    materiaInativa: { color: '#aaa', fontStyle: 'italic' }, // Cinza itálico para os outros professores
    cardSubtitle: { color: '#666', fontSize: 12, marginTop: 6 },
    card: { 
    backgroundColor: '#1e1e1e', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: '#007AFF', // Cor azul padrão para as disciplinas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
},
cardCH: { 
    color: '#888', 
    fontSize: 13, 
    fontWeight: 'bold',
    backgroundColor: '#2d2d2d', // Deixa a carga horária em uma caixinha discreta
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
},
    cardProfessor: { color: '#7ED321', fontSize: 13, marginTop: 6, fontWeight: '500' }
});