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
      <View style={styles.menuGrid}>
    {/* 1. ADMINISTRADOR E PROFESSOR: Veem a parte de Alunos */}
    {(perfilUsuario === 'Adm' || perfilUsuario === 'Professor') && (
        <>
            <MenuCard title="Cadastrar Aluno" icon="account-plus" screen="CadastroAluno" />
            <MenuCard title="Ver Alunos" icon="account-group" screen="ListaAlunos" />
        </>
    )}

    {/* 2. APENAS ADMINISTRADOR: Vê a gestão de Professores */}
    {perfilUsuario === 'Adm' && (
        <MenuCard title="Professores" icon="teach" screen="CadastroProfessores" />
    )}

    {/* 3. TODOS: Veem as Disciplinas */}
    <MenuCard title="Disciplinas" icon="book-open-variant" screen="CadastroDisciplinas" />
    
    {/* 4. APENAS ALUNOS: Veem o Boletim */}
    {perfilUsuario === 'Aluno' && (
        <MenuCard title="Meu Boletim" icon="file-document-outline" screen="VisualizacaoBoletim" />
    )}
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
  container: { flex: 1, experimental_backgroundImage: '#f0f2f5' },
  header: { padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  subText: { fontSize: 14, color: '#666' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15 },
  card: {
    backgroundColor: 'rgba(20, 22, 31, 0.9)',
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
  logoutText: { color: 'red', fontWeight: 'bold' },
  cardAdmin: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 12, 
        marginTop: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF', // Azul para destacar que é uma ação do Admin
        elevation: 3, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    cardTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    cardDesc: { 
        fontSize: 13, 
        color: '#777', 
        marginTop: 5 
    }
});