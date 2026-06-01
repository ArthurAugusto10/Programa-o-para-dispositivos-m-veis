import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

interface Aluno {
    id: number;
    nome: string;
    ra: string;
    email: string;
};

export default function ListaAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarAlunos();
    }, []);

    const buscarAlunos = async () => {
        try {
            const response = await api.get('/alunos');
            setAlunos(response.data);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.info}>RA: {item.ra}</Text>
            <Text style={styles.info}>E-mail: {item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alunos Cadastrados</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={alunos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text style={styles.empty}>Nenhum aluno cadastrado ainda.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, marginTop: 30 },
    card: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        elevation: 2
    },
    nome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    info: { fontSize: 14, color: '#666', marginTop: 4 },
    empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' }
});