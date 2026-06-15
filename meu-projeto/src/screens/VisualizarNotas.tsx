import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

interface Disciplina {
    id: number;
    nome: string;
}

interface AlunoNota {
    aluno_id: number;
    aluno_nome: string;
    aluno_ra: string;
    nota1: number;
    nota2: number;
    faltas: number;
}

export default function VisualizarNotas({ route }: any) {
    const { emailUsuario } = route.params || { emailUsuario: '' };
    
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | string>('');
    const [notasTurma, setNotasTurma] = useState<AlunoNota[]>([]);
    const [loadingDisciplinas, setLoadingLoadingDisciplinas] = useState(true);
    const [loadingNotas, setLoadingNotas] = useState(false);

    // 1. Carrega as disciplinas do professor logado
    useEffect(() => {
        if (!emailUsuario) return;
        api.get(`/professores/${emailUsuario}/disciplinas`)
            .then(response => {
                setDisciplinas(response.data);
                setLoadingLoadingDisciplinas(false);
            })
            .catch(error => {
                console.error(error);
                setLoadingLoadingDisciplinas(false);
            });
    }, [emailUsuario]);

    // 2. Busca a lista de notas da disciplina selecionada
    useEffect(() => {
        if (!disciplinaSelecionada) {
            setNotasTurma([]);
            return;
        }

        setLoadingNotas(true);
        api.get(`/notas/disciplina/${disciplinaSelecionada}`)
            .then(response => {
                setNotasTurma(response.data);
                setLoadingNotas(false);
            })
            .catch(error => {
                console.error(error);
                setLoadingNotas(false);
            });
    }, [disciplinaSelecionada]);

    if (loadingDisciplinas) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notas Lançadas</Text>

            <Text style={styles.label}>Selecione a Disciplina:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={disciplinaSelecionada}
                    onValueChange={(itemValue) => setDisciplinaSelecionada(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#7ED321"
                >
                    <Picker.Item label="Escolha uma matéria..." value="" />
                    {disciplinas.map((disc) => (
                        <Picker.Item key={disc.id} label={disc.nome} value={disc.id} />
                    ))}
                </Picker>
            </View>

            {loadingNotas ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#7ED321" />
                </View>
            ) : (
                <FlatList
                    data={notasTurma}
                    keyExtractor={(item) => item.aluno_id.toString()}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {disciplinaSelecionada ? "Nenhum registro encontrado." : "Selecione uma matéria para exibir o relatório de notas."}
                        </Text>
                    }
                    renderItem={({ item }) => {
                        const n1 = parseFloat(item.nota1.toString());
                        const n2 = parseFloat(item.nota2.toString());
                        const media = (n1 + n2) / 2;

                        return (
                            <View style={styles.notaCard}>
                                <View style={styles.topoCard}>
                                    <Text style={styles.alunoNome}>{item.aluno_nome}</Text>
                                    <Text style={styles.alunoRa}>RA: {item.aluno_ra}</Text>
                                </View>
                                
                                <View style={styles.placarGrid}>
                                    <View style={styles.placarItem}>
                                        <Text style={styles.placarLabel}>N1</Text>
                                        <Text style={styles.placarValor}>{n1.toFixed(1)}</Text>
                                    </View>
                                    <View style={styles.placarItem}>
                                        <Text style={styles.placarLabel}>N2</Text>
                                        <Text style={styles.placarValor}>{n2.toFixed(1)}</Text>
                                    </View>
                                    <View style={styles.placarItem}>
                                        <Text style={styles.placarLabel}>MÉDIA</Text>
                                        <Text style={[styles.placarValor, media >= 6 ? styles.aprovado : styles.reprovado]}>
                                            {media.toFixed(1)}
                                        </Text>
                                    </View>
                                    <View style={styles.placarItem}>
                                        <Text style={styles.placarLabel}>FALTAS</Text>
                                        <Text style={styles.placarValor}>{item.faltas}</Text>
                                    </View>
                                </View>
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    label: { color: '#fff', fontSize: 16, marginBottom: 8 },
    pickerContainer: { backgroundColor: '#1e1e1e', borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
    picker: { color: '#fff', height: 50, backgroundColor: '#1e1e1e' },
    emptyText: { color: '#aaa', textAlign: 'center', fontSize: 16, marginTop: 40 },
    notaCard: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
    topoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2d2d2d', paddingBottom: 8 },
    alunoNome: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    alunoRa: { color: '#888', fontSize: 12 },
    placarGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    placarItem: { alignItems: 'center', width: '23%' },
    placarLabel: { color: '#aaa', fontSize: 11, marginBottom: 2, fontWeight: '600' },
    placarValor: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    aprovado: { color: '#7ED321' },
    reprovado: { color: '#FF3B30' }
});