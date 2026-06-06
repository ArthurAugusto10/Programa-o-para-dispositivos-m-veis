import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

interface Aluno { id: number; nome: string; ra: string; }
interface Disciplina { id: number; nome: string; }

export default function MatricularAluno({ navigation }: any) {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState<number | string>('');
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | string>('');
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        // Carrega os dados bases para os Pickers (Ajuste os endpoints se necessário)
        Promise.all([
            api.get('/alunos'), // Endpoint que traz todos os alunos
            api.get('/disciplinas') // Endpoint que traz todas as disciplinas
        ])
        .then(([resAlunos, resDisciplinas]) => {
            setAlunos(resAlunos.data);
            setDisciplinas(resDisciplinas.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Erro ao carregar dados de matrícula:", error);
            setLoading(false);
        });
    }, []);

    const handleMatricular = async () => {
        if (!alunoSelecionado || !disciplinaSelecionada) {
            Alert.alert("Erro", "Por favor, selecione um aluno e uma disciplina.");
            return;
        }

        setEnviando(true);
        try {
            await api.post('/aluno/matricular', {
                aluno_id: alunoSelecionado,
                disciplina_id: disciplinaSelecionada
            });
            
            Alert.alert("Sucesso 🎉", "Aluno matriculado com sucesso!");
            navigation.goBack();
        } catch (error: any) {
            const msgErro = error.response?.data?.error || "Erro ao conectar com o servidor.";
            Alert.alert("Erro de Matrícula", msgErro);
        } finally {
            setEnviando(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nova Matrícula</Text>

            <Text style={styles.label}>Selecione o Aluno:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={alunoSelecionado}
                    onValueChange={(val) => setAlunoSelecionado(val)}
                    style={styles.picker}
                    dropdownIconColor="#007AFF"
                >
                    <Picker.Item label="Escolha o aluno..." value="" />
                    {alunos.map(aluno => (
                        <Picker.Item key={aluno.id} label={`${aluno.nome} (RA: ${aluno.ra})`} value={aluno.id} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Selecione a Disciplina:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={disciplinaSelecionada}
                    onValueChange={(val) => setDisciplinaSelecionada(val)}
                    style={styles.picker}
                    dropdownIconColor="#007AFF"
                >
                    <Picker.Item label="Escolha a matéria..." value="" />
                    {disciplinas.map(disc => (
                        <Picker.Item key={disc.id} label={disc.nome} value={disc.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity 
                style={[styles.btnConfirmar, enviando && { opacity: 0.6 }]} 
                onPress={handleMatricular}
                disabled={enviando}
            >
                {enviando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnText}>Confirmar Matrícula</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 25, marginTop: 10 },
    label: { color: '#aaa', fontSize: 14, marginBottom: 8, fontWeight: '600' },
    pickerContainer: { backgroundColor: '#1e1e1e', borderRadius: 8, overflow: 'hidden', marginBottom: 25 },
    picker: { color: '#fff', height: 50, backgroundColor: '#1e1e1e' },
    btnConfirmar: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});