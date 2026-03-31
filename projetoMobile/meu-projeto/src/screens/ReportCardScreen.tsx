import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../styles/globalStyles';

interface Discipline {
  id: string;
  nome: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
}

export default function ReportCardScreen() {
  const [loading, setLoading] = useState(true);
  const [boletim, setBoletim] = useState<Discipline[]>([]);

  useEffect(() => {
    // Simulação de carregamento de dados simulados [cite: 17, 70, 134]
    setTimeout(() => {
      setBoletim([
        { id: '1', nome: 'Programação Móvel I', nota1: 8.5, nota2: 9.0, media: 8.75, situacao: 'Aprovado' },
        { id: '2', nome: 'Banco de Dados', nota1: 7.0, nota2: 6.5, media: 6.75, situacao: 'Aprovado' },
        { id: '3', nome: 'Engenharia de Software', nota1: 5.0, nota2: 4.5, media: 4.75, situacao: 'Exame' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }: { item: Discipline }) => (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{item.nome}</Text>
      <View style={styles.row}>
        <View style={styles.info}><Text style={styles.label}>N1</Text><Text>{item.nota1}</Text></View>
        <View style={styles.info}><Text style={styles.label}>N2</Text><Text>{item.nota2}</Text></View>
        <View style={styles.info}><Text style={styles.label}>Média</Text><Text style={{fontWeight: 'bold'}}>{item.media}</Text></View>
        <View style={styles.info}>
          <Text style={styles.label}>Situação</Text>
          <Text style={[styles.status, item.situacao === 'Aprovado' ? {color: Colors.success} : {color: 'orange'}]}>
            {item.situacao}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Carregando Boletim...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={boletim}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.header}>Consulta de Boletim</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.padding },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: Colors.white, padding: 15, borderRadius: Spacing.borderRadius, marginBottom: 15, elevation: 2 },
  subjectName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  info: { alignItems: 'center' },
  label: { fontSize: 12, color: '#888' },
  status: { fontWeight: 'bold', fontSize: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});