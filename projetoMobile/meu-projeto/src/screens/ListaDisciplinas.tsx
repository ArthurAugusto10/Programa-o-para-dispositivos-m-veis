import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

interface Disciplina {
    id: number;
    nome: string;
    carga_horaria: number;
    professor_nome: string | null;
}

export default function ListaDisciplinas({ route }: any) {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(true);

    // Captura o perfil e o email de quem está logado (enviados pelo Dashboard)
    const { perfilUsuario, emailUsuario } = route.params || { perfilUsuario: 'Adm', emailUsuario: '' };

    useEffect(() => {
        // Se for Professor, busca apenas as matérias dele. Se for Adm, busca todas.
        const urlEndpoint = perfilUsuario === 'Professor' 
            ? `/professores/${emailUsuario}/disciplinas` 
            : '/disciplinas';

        api.get(urlEndpoint)
            .then(response => {
                setDisciplinas(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar disciplinas:", error);
                setLoading(false);
            });
    }, [perfilUsuario, emailUsuario]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {perfilUsuario === 'Professor' ? 'Minhas Disciplinas Atribuídas' : 'Disciplinas Cadastradas'}
            </Text>
            <FlatList
                data={disciplinas}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.nome}</Text>
                        <Text style={styles.detail}>Carga Horária: {item.carga_horaria} horas</Text>
                        {perfilUsuario !== 'Professor' && (
                            <Text style={styles.detail}>
                                Professor: {item.professor_nome || 'Sem professor atribuído'}
                            </Text>
                        )}
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