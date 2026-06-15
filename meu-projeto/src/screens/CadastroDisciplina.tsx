import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

interface Professor {
    id: number;
    nome: string;
}

export default function CadastroDisciplina({ navigation }: any) {
    const [nome, setNome] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [professorId, setProfessorId] = useState<string | number>('');
    const [professores, setProfessores] = useState<Professor[]>([]);

    // Carrega os professores cadastrados no banco para o Dropdown
    useEffect(() => {
        api.get('/professores')
            .then(response => setProfessores(response.data))
            .catch(error => console.error("Erro ao carregar professores:", error));
    }, []);

    const handleSalvar = async () => {
        if (!nome || !cargaHoraria) {
            alert("Nome e Carga Horária são obrigatórios.");
            return;
        }

        try {
            await api.post('/disciplinas', {
                nome,
                carga_horaria: cargaHoraria,
                professor_id: professorId || null // Envia null se escolher a opção padrão
            });
            alert("Sucesso: Disciplina cadastrada!");
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Erro ao conectar com o servidor";
            alert("Erro no Cadastro: " + msg);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastrar Nova Disciplina</Text>
            
            <Text style={styles.label}>Nome da Disciplina</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Banco de Dados II" placeholderTextColor="#999" />

            <Text style={styles.label}>Carga Horária (Horas)</Text>
            <TextInput style={styles.input} value={cargaHoraria} onChangeText={setCargaHoraria} keyboardType="numeric" placeholder="Ex: 80" placeholderTextColor="#999" />

            <Text style={styles.label}>Professor Responsável</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={professorId}
                    onValueChange={(itemValue) => setProfessorId(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#7ED321"
                >
                    <Picker.Item label="Selecione um professor (Opcional)" value="" />
                    {professores.map((prof) => (
                        <Picker.Item key={prof.id} label={prof.nome} value={prof.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                <Text style={styles.buttonText}>Confirmar Cadastro</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    label: { color: '#fff', fontSize: 16, marginBottom: 5, marginTop: 15 },
    input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 5, fontSize: 16 },
    pickerContainer: { backgroundColor: '#1e1e1e', borderRadius: 5, marginTop: 5, overflow: 'hidden' },
    picker: { color: '#fff', height: 50, backgroundColor: '#1e1e1e' },
    button: { backgroundColor: '#7ED321', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 30 },
    buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
    cancelText: { color: '#FF3B30', textAlign: 'center', marginTop: 20, fontSize: 16 }
});