import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../styles/globalStyles';

export default function DashboardScreen({ route, navigation }: any) {
  // Captura o perfil selecionado no Login (Padrão Aluno)
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };

  // Componente de Card reutilizável que envia o perfil para a próxima tela
  const MenuCard = ({ title, icon, screen }: { title: string, icon: any, screen: string }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate(screen, { perfilUsuario })}
    >
      <MaterialCommunityIcons name={icon} size={40} color={Colors.primary} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {perfilUsuario}!</Text>
        <Text style={styles.subText}>Painel Acadêmico Scholar</Text>
      </View>

      <View style={styles.menuGrid}>
        {/* Administradores e Professores veem gestão de alunos */}
        {(perfilUsuario === 'Adm' || perfilUsuario === 'Professor') && (
          <MenuCard title="Alunos" icon="account-education" screen="CadastroAlunos" />
        )}

        <MenuCard title="Professores" icon="teach" screen="CadastroProfessores" />
        <MenuCard title="Disciplinas" icon="book-open-variant" screen="CadastroDisciplinas" />
        <MenuCard title="Meu Boletim" icon="file-document-outline" screen="VisualizacaoBoletim" />
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutText}>Sair do Sistema</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  subText: { fontSize: 14, color: '#666' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15 },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    height: 140,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3
  },
  cardText: { marginTop: 10, fontSize: 14, fontWeight: '600', color: '#444' },
  logoutButton: { margin: 20, padding: 15, alignItems: 'center', borderRadius: 10, backgroundColor: '#fee' },
  logoutText: { color: 'red', fontWeight: 'bold' }
});