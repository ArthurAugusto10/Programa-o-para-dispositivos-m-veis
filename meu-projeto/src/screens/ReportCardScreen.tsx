import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing } from '../styles/globalStyles';
import { CustomButton } from '../components/CustomButton';

interface Discipline {
  id: string;
  nome: string;
  n1: number;
  n2: number;
  media: number;
  status: string;
}

export default function ReportCardScreen({ route }: any) {
  // Captura o perfil vindo do Dashboard
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  
  // Define permissão: Prof e Adm podem gerenciar notas
  const podeGerenciarNotas = perfilUsuario === 'Adm' || perfilUsuario === 'Professor';

  const [loading, setLoading] = useState(true);
  const [boletim, setBoletim] = useState<Discipline[]>([]);

  useEffect(() => {
    // Simulação de busca de dados (useEffect obrigatório)
    const loadBoletim = () => {
      const mockData: Discipline[] = [
        { id: '1', nome: 'Programação Móvel I', n1: 8.5, n2: 9.0, media: 8.75, status: 'Aprovado' },
        { id: '2', nome: 'Banco de Dados', n1: 7.0, n2: 6.5, media: 6.75, status: 'Aprovado' },
        { id: '3', nome: 'Engenharia de Software', n1: 5.0, n2: 4.5, media: 4.75, status: 'Exame' },
      ];

      setTimeout(() => {
        setBoletim(mockData);
        setLoading(false);
      }, 1000);
    };

    loadBoletim();
  }, []);

  const handleEditNota = (disciplina: string) => {
    Alert.alert("Gestão Acadêmica", `Abrindo formulário de edição para: ${disciplina}\n(Funcionalidade da Parte 2)`);
  };

  const renderItem = ({ item }: { item: Discipline }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.subjectName}>{item.nome}</Text>
        <Text style={[styles.statusBadge, item.status === 'Aprovado' ? styles.approved : styles.warning]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.gradesRow}>
        <View style={styles.gradeBox}>
          <Text style={styles.label}>N1</Text>
          <Text style={styles.value}>{item.n1.toFixed(1)}</Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={styles.label}>N2</Text>
          <Text style={styles.value}>{item.n2.toFixed(1)}</Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={styles.label}>Média</Text>
          <Text style={[styles.value, { fontWeight: 'bold' }]}>{item.media.toFixed(2)}</Text>
        </View>
      </View>

      {/* Botão condicional: Só aparece para Professor ou Adm */}
      {podeGerenciarNotas && (
        <View style={styles.actionContainer}>
          <CustomButton 
            title="Lançar / Editar Notas" 
            onPress={() => handleEditNota(item.nome)} 
            color={Colors.secondary} 
          />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Carregando dados acadêmicos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {podeGerenciarNotas ? "Gerenciamento de Notas" : "Meu Boletim"}
      </Text>
      
      <FlatList
        data={boletim}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.padding },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  subjectName: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, flex: 1 },
  statusBadge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, overflow: 'hidden' },
  approved: { backgroundColor: '#E8F5E9', color: 'green' },
  warning: { backgroundColor: '#FFF3E0', color: 'orange' },
  gradesRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  gradeBox: { alignItems: 'center' },
  label: { fontSize: 12, color: '#888', marginBottom: 4 },
  value: { fontSize: 15, color: '#333' },
  actionContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 5 }
});