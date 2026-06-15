import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

interface Professor {
    id: number;
    nome: string;
    email: string;
    especialidade: string;
}

export default function ListaProfessores() {
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/professores')
            .then(response => {
                setProfessores(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar professores:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Professores Cadastrados</Text>
            <FlatList
                data={professores}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum professor cadastrado ainda.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.nome}</Text>
                        <Text style={styles.detail}>E-mail: {item.email}</Text>
                        {item.especialidade && <Text style={styles.detail}>Especialidade: {item.especialidade}</Text>}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    emptyText: { color: '#aaa', textAlign: 'center', fontSize: 16, marginTop: 40 },
    card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#7ED321' },
    name: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    detail: { color: '#aaa', fontSize: 14, marginTop: 2 }
});