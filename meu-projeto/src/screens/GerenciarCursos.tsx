import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Colors } from '../styles/globalStyles';
import api from '../services/api';

interface Curso {
    id: number;
    nome: string;
    area: string;
    duracao: number;
    coordenador_id: number | null;
    coordenador_nome: string | null;
}

interface Professor {
    id: number;
    nome: string;
}

export default function GerenciarCursos() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisivel, setModalVisivel] = useState(false);

    // Estados do formulário (Modal)
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
    const [nome, setNome] = useState('');
    const [area, setArea] = useState('');
    const [duracao, setDuracao] = useState('');
    const [coordenadorSelecionado, setCoordenadorSelecionado] = useState<string>('');

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    const carregarDadosIniciais = async () => {
        setLoading(true);
        try {
            // Executa a busca de cursos e professores simultaneamente
            const [resCursos, resProfessores] = await Promise.all([
                api.get('/cursos'),
                api.get('/professores') // Reaproveita a sua rota existente de listagem de professores
            ]);
            setCursos(resCursos.data);
            setProfessores(resProfessores.data);
        } catch (error) {
            console.error("Erro ao carregar dados inicias do módulo:", error);
            alert("Não foi possível carregar os dados.");
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCadastro = () => {
        setIdSelecionado(null);
        setNome('');
        setArea('');
        setDuracao('');
        setCoordenadorSelecionado('');
        setModalVisivel(true);
    };

    const abrirModalEdicao = (curso: Curso) => {
        setIdSelecionado(curso.id);
        setNome(curso.nome);
        setArea(curso.area);
        setDuracao(curso.duracao.toString());
        setCoordenadorSelecionado(curso.coordenador_id ? curso.coordenador_id.toString() : '');
        setModalVisivel(true);
    };

    const handleSalvarCurso = async () => {
        if (!nome || !area || !duracao) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const dadosCurso = { 
                nome, 
                area, 
                duracao: Number(duracao),
                coordenador_id: coordenadorSelecionado ? Number(coordenadorSelecionado) : null
            };

            if (idSelecionado) {
                await api.put(`/cursos/${idSelecionado}`, dadosCurso);
                alert("Curso atualizado com sucesso!");
            } else {
                await api.post('/cursos', dadosCurso);
                alert("Curso cadastrado com sucesso!");
            }

            setModalVisivel(false);
            carregarDadosIniciais();
        } catch (error) {
            console.error("Erro ao salvar curso:", error);
            alert("Falha ao salvar os dados do curso.");
        }
    };

    const handleDeletarCurso = async (id: number) => {
        const confirmar = window.confirm("Tem certeza de que deseja remover este curso permanentemente?");
        if (!confirmar) return;

        try {
            await api.delete(`/cursos/${id}`);
            alert("Curso removido com sucesso!");
            carregarDadosIniciais();
        } catch (error) {
            console.error("Erro ao deletar curso:", error);
            alert("Não foi possível remover o curso.");
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary || '#7ED321'} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Painel Geral: Cursos</Text>
                <Text style={styles.subtitle}>Módulo Complementar Acadêmico</Text>
            </View>

            <TouchableOpacity style={styles.btnAdicionar} onPress={abrirModalCadastro}>
                <Text style={styles.btnAdicionarText}>+ Cadastrar Novo Curso</Text>
            </TouchableOpacity>

            <FlatList
                data={cursos}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum curso registrado no PostgreSQL.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{item.nome}</Text>
                            <Text style={styles.cardSubtitle}>Área: {item.area} | Duração: {item.duracao} Semestres</Text>
                            {/* Exibe o nome do coordenador se houver um vinculado */}
                            <Text style={styles.cardCoordenador}>
                                👤 Coordenação: {item.coordenador_nome || 'Sem coordenador atribuído'}
                            </Text>
                        </View>
                        <View style={styles.cardAcoes}>
                            <TouchableOpacity style={styles.btnEditar} onPress={() => abrirModalEdicao(item)}>
                                <Text style={styles.btnTextAcao}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnDeletar} onPress={() => handleDeletarCurso(item.id)}>
                                <Text style={styles.btnTextAcao}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Formulário Flutuante */}
            <Modal visible={modalVisivel} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{idSelecionado ? "Atualizar Registro" : "Novo Curso"}</Text>

                        <Text style={styles.label}>Nome do Curso</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ex: Análise de Sistemas" 
                            placeholderTextColor="#666"
                            value={nome}
                            onChangeText={setNome}
                        />

                        <Text style={styles.label}>Área de Conhecimento</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ex: Tecnologia, Gestão" 
                            placeholderTextColor="#666"
                            value={area}
                            onChangeText={setArea}
                        />

                        <Text style={styles.label}>Duração (em Semestres)</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Ex: 6" 
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={duracao}
                            onChangeText={setDuracao}
                        />

                        {/* 🎯 EVOLUÇÃO PEDIDA PELO PROF. ANDRÉ: Seletor de Coordenador */}
                        <Text style={styles.label}>Professor Coordenador</Text>
                        <View style={styles.selectContainer}>
                            <select
                                value={coordenadorSelecionado}
                                onChange={(e) => setCoordenadorSelecionado(e.target.value)}
                                style={webSelectStyle}
                            >
                                <option value="">-- Atribuir Coordenador (Opcional) --</option>
                                {professores.map((prof) => (
                                    <option key={prof.id} value={prof.id} style={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
                                        {prof.nome}
                                    </option>
                                ))}
                            </select>
                        </View>

                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvarCurso}>
                                <Text style={styles.btnSalvarText}>Salvar Dados</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisivel(false)}>
                                <Text style={styles.btnSalvarText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    subtitle: { fontSize: 13, color: '#7ED321', marginTop: 4 },
    btnAdicionar: { backgroundColor: '#7ED321', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    emptyText: { color: '#aaa', textAlign: 'center', marginTop: 40, fontSize: 16 },
    
    // Cards da Lista
    card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#7ED321' },
    cardInfo: { flex: 1 },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { color: '#aaa', fontSize: 13, marginTop: 4 },
    cardCoordenador: { color: '#7ED321', fontSize: 12, marginTop: 6, fontWeight: '500' },
    cardAcoes: { flexDirection: 'row', gap: 8 },
    btnEditar: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
    btnDeletar: { backgroundColor: '#FF3B30', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
    btnTextAcao: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    
    // Design do Modal
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
    modalContent: { backgroundColor: '#1e1e1e', width: '85%', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
    modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    label: { color: '#fff', fontSize: 13, marginBottom: 5, fontWeight: '500' },
    input: { backgroundColor: '#2d2d2d', color: '#fff', padding: 12, borderRadius: 6, marginBottom: 15, fontSize: 15 },
    selectContainer: {
        backgroundColor: '#2d2d2d',
        borderRadius: 6,
        overflow: 'hidden',
        height: 45,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    modalBotoes: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
    btnSalvar: { flex: 1, backgroundColor: '#7ED321', padding: 12, borderRadius: 6, alignItems: 'center' },
    btnCancelar: { flex: 1, backgroundColor: '#555', padding: 12, borderRadius: 6, alignItems: 'center' },
    btnSalvarText: { color: '#fff', fontWeight: 'bold' }
});

const webSelectStyle = {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    outline: 'none',
    width: '100%',
    height: '100%',
    fontSize: '15px',
    cursor: 'pointer'
};