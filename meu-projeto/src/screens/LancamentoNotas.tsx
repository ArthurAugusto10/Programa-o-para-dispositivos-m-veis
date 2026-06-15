import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
    nota1: string;
    nota2: string;
    faltas: string;
}

export default function LancamentoNotas({ route }: any) {
    const { emailUsuario } = route.params || { emailUsuario: '' };
    
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | string>('');
    const [alunos, setAlunos] = useState<AlunoNota[]>([]);
    const [loadingDisciplinas, setLoadingLoadingDisciplinas] = useState(true);
    const [loadingAlunos, setLoadingAlunos] = useState(false);

    // 1. Carrega as disciplinas do professor logado para alimentar o Dropdown
    useEffect(() => {
        if (!emailUsuario) return;
        
        api.get(`/professores/${emailUsuario}/disciplinas`)
            .then(response => {
                setDisciplinas(response.data);
                setLoadingLoadingDisciplinas(false);
            })
            .catch(error => {
                console.error("Erro ao carregar disciplinas do professor:", error);
                setLoadingLoadingDisciplinas(false);
            });
    }, [emailUsuario]);

    // 2. Sempre que o professor mudar a disciplina no Dropdown, busca a lista de alunos e notas atuais
    useEffect(() => {
        if (!disciplinaSelecionada) {
            setAlunos([]);
            return;
        }

        setLoadingAlunos(true);
        api.get(`/notas/disciplina/${disciplinaSelecionada}`)
            .then(response => {
                // Transforma os números vindos do banco em string para os Inputs do React Native
                const dadosFormatados = response.data.map((item: any) => ({
                    aluno_id: item.aluno_id,
                    aluno_nome: item.aluno_nome,
                    aluno_ra: item.aluno_ra,
                    nota1: item.nota1.toString(),
                    nota2: item.nota2.toString(),
                    faltas: item.faltas.toString()
                }));
                setAlunos(dadosFormatados);
                setLoadingAlunos(false);
            })
            .catch(error => {
                console.error("Erro ao buscar alunos/notas:", error);
                setLoadingAlunos(false);
            });
    }, [disciplinaSelecionada]);

    // 3. Atualiza o estado local do array de alunos quando o professor digita em uma linha específica
    const handleInputChange = (alunoId: number, campo: 'nota1' | 'nota2' | 'faltas', valor: string) => {
        setAlunos(prevAlunos =>
            prevAlunos.map(aluno =>
                aluno.aluno_id === alunoId ? { ...aluno, [campo]: valor } : aluno
            )
        );
    };

    // 4. Faz a requisição POST para salvar/atualizar os dados no banco usando a rota de notas
    const salvarNotaAluno = async (aluno: AlunoNota) => {
        try {
            await api.post('/notas', {
                aluno_id: aluno.aluno_id,
                disciplina_id: disciplinaSelecionada,
                nota1: aluno.nota1 || 0,
                nota2: aluno.nota2 || 0,
                faltas: aluno.faltas || 0
            });
            Alert.alert("Sucesso", `Notas de ${aluno.aluno_nome} salvas com sucesso!`);
        } catch (error: any) {
            console.error("Erro ao salvar nota:", error);
            Alert.alert("Erro", "Não foi possível salvar o registro de notas.");
        }
    };

    if (loadingDisciplinas) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lançamento de Notas</Text>

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

            {loadingAlunos ? (
                <View style={styles.centerAlunos}>
                    <ActivityIndicator size="large" color="#7ED321" />
                </View>
            ) : (
                <FlatList
                    data={alunos}
                    keyExtractor={(item) => item.aluno_id.toString()}
                    style={styles.list}
                    ListEmptyComponent={
                        disciplinaSelecionada ? (
                            <Text style={styles.emptyText}>Nenhum aluno cadastrado no sistema.</Text>
                        ) : (
                            <Text style={styles.emptyText}>Selecione uma matéria acima para carregar a pauta.</Text>
                        )
                    }
                    renderItem={({ item }) => (
                        <View style={styles.alunoCard}>
                            <View style={styles.alunoInfo}>
                                <Text style={styles.alunoNome}>{item.aluno_nome}</Text>
                                <Text style={styles.alunoRa}>RA: {item.aluno_ra}</Text>
                            </View>

                            <View style={styles.inputsRow}>
                                <View style={styles.inputBlock}>
                                    <Text style={styles.inputLabel}>N1</Text>
                                    <TextInput
                                        style={styles.inputNota}
                                        value={item.nota1}
                                        onChangeText={(v) => handleInputChange(item.aluno_id, 'nota1', v)}
                                        keyboardType="numeric"
                                        placeholder="0.0"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.inputLabel}>N2</Text>
                                    <TextInput
                                        style={styles.inputNota}
                                        value={item.nota2}
                                        onChangeText={(v) => handleInputChange(item.aluno_id, 'nota2', v)}
                                        keyboardType="numeric"
                                        placeholder="0.0"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.inputLabel}>Faltas</Text>
                                    <TextInput
                                        style={styles.inputNota}
                                        value={item.faltas}
                                        onChangeText={(v) => handleInputChange(item.aluno_id, 'faltas', v)}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#666"
                                    />
                                </View>

                                <TouchableOpacity style={styles.saveButton} onPress={() => salvarNotaAluno(item)}>
                                    <Text style={styles.saveButtonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    centerAlunos: { marginTop: 50, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    label: { color: '#fff', fontSize: 16, marginBottom: 8 },
    pickerContainer: { backgroundColor: '#1e1e1e', borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
    picker: { color: '#fff', height: 50, backgroundColor: '#1e1e1e' },
    list: { marginTop: 10 },
    emptyText: { color: '#aaa', textAlign: 'center', fontSize: 16, marginTop: 40 },
    alunoCard: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 15 },
    alunoInfo: { marginBottom: 12 },
    alunoNome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    alunoRa: { color: '#888', fontSize: 13, marginTop: 2 },
    inputsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
    inputBlock: { alignItems: 'center', width: '20%' },
    inputLabel: { color: '#aaa', fontSize: 12, marginBottom: 4 },
    inputNota: { backgroundColor: '#2d2d2d', color: '#fff', width: '100%', padding: 8, borderRadius: 5, textAlign: 'center', fontSize: 15 },
    saveButton: { backgroundColor: '#7ED321', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, justifyContent: 'center' },
    saveButtonText: { color: '#000', fontWeight: 'bold', fontSize: 14 }
});