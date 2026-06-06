import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

interface BoletimItem {
    disciplina_name: string; // alterado para casar com o seu alias do SQL (disciplina_nome)
    disciplina_nome?: string; 
    carga_horaria: number;
    nota1: number;
    nota2: number;
    faltas: number;
}

export default function Boletim({ route }: any) {
    const { emailUsuario } = route.params || { emailUsuario: '' };
    const [boletim, setBoletim] = useState<BoletimItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!emailUsuario) return;

        api.get(`/boletim/${emailUsuario}`)
            .then(response => {
                setBoletim(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar boletim:", error);
                setLoading(false);
            });
    }, [emailUsuario]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7ED321" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Boletim Oficial</Text>
            
            <FlatList
                data={boletim}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma nota lançada para você ainda.</Text>}
                renderItem={({ item }) => {
                    const nomeMateria = item.disciplina_nome || item.disciplina_name || "Disciplina";
                    const n1 = parseFloat(item.nota1.toString());
                    const n2 = parseFloat(item.nota2.toString());
                    const media = (n1 + n2) / 2;
                    const status = media >= 6.0 ? 'APROVADO' : 'REPROVADO';

                    return (
                        <View style={styles.boletimCard}>
                            <View style={styles.headerCard}>
                                <Text style={styles.materiaNome}>{nomeMateria}</Text>
                                <Text style={styles.cargaHoraria}>{item.carga_horaria}h</Text>
                            </View>

                            <View style={styles.notasGrid}>
                                <View style={styles.notaBox}>
                                    <Text style={styles.notaLabel}>N1</Text>
                                    <Text style={styles.notaValue}>{n1.toFixed(1)}</Text>
                                </View>
                                <View style={styles.notaBox}>
                                    <Text style={styles.notaLabel}>N2</Text>
                                    <Text style={styles.notaValue}>{n2.toFixed(1)}</Text>
                                </View>
                                <View style={styles.notaBox}>
                                    <Text style={styles.notaLabel}>FALTAS</Text>
                                    <Text style={styles.notaValue}>{item.faltas}</Text>
                                </View>
                                <View style={styles.notaBox}>
                                    <Text style={styles.notaLabel}>MÉDIA</Text>
                                    <Text style={[styles.notaValue, media >= 6 ? styles.textAprovado : styles.textReprovado]}>
                                        {media.toFixed(1)}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.statusBadge, media >= 6 ? styles.badgeAprovado : styles.badgeReprovado]}>
                                <Text style={styles.statusText}>{status}</Text>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 10 },
    emptyText: { color: '#aaa', textAlign: 'center', fontSize: 16, marginTop: 40 },
    boletimCard: { backgroundColor: '#1e1e1e', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
    headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#2d2d2d', paddingBottom: 8 },
    materiaNome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    cargaHoraria: { color: '#888', fontSize: 14 },
    notasGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    notaBox: { alignItems: 'center', width: '22%' },
    notaLabel: { color: '#aaa', fontSize: 11, marginBottom: 4, fontWeight: '600' },
    notaValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    textAprovado: { color: '#7ED321' },
    textReprovado: { color: '#FF3B30' },
    statusBadge: { paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
    badgeAprovado: { backgroundColor: 'rgba(126, 211, 33, 0.15)', borderWidth: 1, borderColor: '#7ED321' },
    badgeReprovado: { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderWidth: 1, borderColor: '#FF3B30' },
    statusText: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }
});