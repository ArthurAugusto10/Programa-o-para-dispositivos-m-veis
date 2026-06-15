import React, { useState, useEffect } from 'react'; // 🎯 Adicionado useEffect aqui
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';
import api from '../services/api';

// Interface para estruturar os cursos recebidos da API
interface Curso {
    id: number;
    nome: string;
}

export default function CadastroAluno({ navigation }: any) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [ra, setRa] = useState('');
    const [senha, setSenha] = useState('');
    
    // 🎯 Estados para o Módulo de Cursos
    const [cursoSelecionado, setCursoSelecionado] = useState<string>('');
    const [listaCursos, setListaCursos] = useState<Curso[]>([]);

    // 🎯 Busca os cursos salvos no PostgreSQL para alimentar o seletor
    useEffect(() => {
        api.get('/cursos')
            .then(response => {
                setListaCursos(response.data);
            })
            .catch(error => {
                console.error("Erro ao carregar cursos para o seletor:", error);
            });
    }, []);

    const handleSalvar = async () => {
        // Log atualizado trazendo o id do curso selecionado no seletor
        console.log("Botão clicado! Dados:", { nome, email, ra, senha, curso_id: cursoSelecionado });
        
        // Validação básica: Nome, E-mail, RA e Senha são cruciais
        if (!nome || !email || !ra || !senha) {
            alert("Campos obrigatórios: Nome, E-mail, RA e Senha."); 
            return;
        }

        try {
            // 🎯 Agora enviamos o curso_id tratado. Caso não selecione nada, envia NULL para o banco
            const response = await api.post('/alunos', { 
                nome, 
                email, 
                ra, 
                senha,
                curso_id: cursoSelecionado ? Number(cursoSelecionado) : null
            });
            
            console.log("Resposta do servidor:", response.data); 
            alert("Sucesso: Aluno cadastrado!");
            navigation.goBack();
        } catch (error: any) {
            console.error("Erro capturado no catch:", error); 
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

            {/* 🎯 REQUISITO 6º: Seletor HTML com design limpo e adaptado às cores claras da tela */}
            <Text style={styles.labelCurso}>Vincular ao Curso</Text>
            <View style={styles.selectContainer}>
                <select
                    value={cursoSelecionado}
                    onChange={(e) => setCursoSelecionado(e.target.value)}
                    style={webSelectStyle}
                >
                    <option value="" style={{ color: '#666' }}>-- Selecione um Curso (Opcional) --</option>
                    {listaCursos.map((curso) => (
                        <option key={curso.id} value={curso.id} style={{ color: '#000' }}>
                            {curso.nome}
                        </option>
                    ))}
                </select>
            </View>

            <View style={{ marginTop: 25 }}>
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
    txtVoltar: { color: '#FF3B30', fontSize: 16, fontWeight: '500' },
    
    // Estilos do novo campo
    labelCurso: { color: '#000', fontSize: 14, fontWeight: '500', marginBottom: 8, marginTop: 15 },
    selectContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        height: 48,
        justifyContent: 'center',
        paddingHorizontal: 10
    }
});

// Estilização invisível para a tag web select casar com o contêiner do React Native
const webSelectStyle = {
    backgroundColor: 'transparent',
    color: '#000',
    border: 'none',
    outline: 'none',
    width: '100%',
    height: '100%',
    fontSize: '15px',
    cursor: 'pointer'
};