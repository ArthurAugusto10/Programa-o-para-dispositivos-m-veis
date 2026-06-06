import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';
import api from '../services/api';

export default function CadastroAluno({ navigation }: any) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    

    const handleSalvar = async () => {
        console.log("Botão clicado! Dados:", { nome, email, ra, senha });
        // Validação básica: Nome, E-mail, RA e Senha são cruciais
        if (!nome || !email || !ra || !senha) {
        alert("Campos obrigatórios: Nome, E-mail, RA e Senha."); // No Web, 'alert' minúsculo funciona melhor
        return;
    }

    try {
        const response = await api.post('/alunos', { nome, email, ra, senha });
        console.log("Resposta do servidor:", response.data); // 👈 Log de sucesso
        alert("Sucesso: Aluno cadastrado!");
        navigation.goBack();
    } catch (error: any) {
        console.error("Erro capturado no catch:", error); // 👈 Log de erro
        const msg = error.response?.data?.error || "Erro ao conectar com o servidor";
        alert("Erro no Cadastro: " + msg);
    }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Cadastrar Novo Aluno</Text>
                <Text style={styles.subtitle}>Perfil: Administrador</Text>
            </View>

            <CustomInput 
                label="Nome do Aluno" 
                value={nome} 
                onChangeText={setNome} 
                placeholder="Nome completo" 
            />

            <CustomInput 
                label="E-mail Acadêmico" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                placeholder="exemplo@fatec.sp.gov.br" 
            />

            <CustomInput 
                label="RA (Registro Acadêmico)" 
                value={ra} 
                onChangeText={setRa} 
                keyboardType="numeric" 
                placeholder="Documento de identificação" 
            />

            <CustomInput 
                label="Senha de Acesso" 
                value={senha} 
                onChangeText={setSenha} 
                secureTextEntry 
                placeholder="Defina a senha inicial do aluno" 
            />


            <View style={{ marginTop: 20 }}>
                <CustomButton title="Confirmar Cadastro" onPress={handleSalvar} color={Colors.primary} />
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
                <Text style={styles.txtVoltar}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { marginBottom: 30, marginTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
    subtitle: { fontSize: 14, color: '#666' },
    btnVoltar: { marginTop: 20, alignItems: 'center', marginBottom: 40 },
    txtVoltar: { color: '#FF3B30', fontSize: 16, fontWeight: '500' }
});