import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import api from '../services/api';

export default function CadastroProfessor({ navigation }: any) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [especialidade, setEspecialidade] = useState('');
    const [senha, setSenha] = useState('');
    const [documento, setDocumento] = useState('');

    const handleSalvar = async () => {
        if (!nome || !email || !senha || !documento) {
            alert("Campos Nome, E-mail, Senha e Documento são obrigatórios.");
            return;
        }

        try {
            await api.post('/professores', { nome, email, especialidade, senha, documento });
            alert("Sucesso: Professor cadastrado!");
            navigation.goBack();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Erro ao conectar com o servidor";
            alert("Erro no Cadastro: " + msg);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastrar Novo Professor</Text>

            {/* 1. Nome */}
            <Text style={styles.label}>Nome do Professor</Text>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Roberto Silva" placeholderTextColor="#999" />

            {/* 2. E-mail */}
            <Text style={styles.label}>E-mail</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="exemplo@fatec.sp.gov.br" placeholderTextColor="#999" />

            {/* 3. Documento */}
            <Text style={styles.label}>CPF ou Matrícula Funcional</Text>
            <TextInput
                style={styles.input}
                value={documento}
                onChangeText={setDocumento}
                keyboardType="numeric" // Facilita a digitação caso usem CPF ou números
                placeholder="Ex: 12345678900"
                placeholderTextColor="#999"
            />

            {/* 4. Especialidade */}
            <Text style={styles.label}>Especialidade (Opcional)</Text>
            <TextInput style={styles.input} value={especialidade} onChangeText={setEspecialidade} placeholder="Ex: Engenharia de Software" placeholderTextColor="#999" />

            {/* 4. Senha de Acesso (Movido para cá!) */}
            <Text style={styles.label}>Senha de Acesso</Text>
            <TextInput
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                placeholder="Digite a senha inicial"
                placeholderTextColor="#999"
            />

            {/* 5. Botões de Ação (Ficam por último no formulário) */}
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
    button: { backgroundColor: '#7ED321', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 30 },
    buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
    cancelText: { color: '#FF3B30', textAlign: 'center', marginTop: 20, fontSize: 16 }
});