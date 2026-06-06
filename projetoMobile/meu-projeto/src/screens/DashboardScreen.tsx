import React, { useEffect } from 'react'; // 🎯 Importado o useEffect aqui!
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../styles/globalStyles';

export default function DashboardScreen({ route, navigation }: any) {
  // 🎯 Agora capturamos o perfil, e-mail E o nome do usuário vindo do Login
  const { perfilUsuario, emailUsuario, nomeUsuario } = route.params || { 
    perfilUsuario: 'Aluno', 
    emailUsuario: '', 
    nomeUsuario: 'Usuário' 
  };

  // 🎯 Atualiza o título da barra azul (TopBar) dinamicamente ao carregar a tela
  useEffect(() => {
    navigation.setOptions({
      title: `Bem vindo, ${nomeUsuario}`
    });
  }, [navigation, nomeUsuario]);

  // Componente de Card reutilizável atualizado para repassar perfil e e-mail
  const MenuCard = ({ title, icon, screen }: { title: string, icon: any, screen: string }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate(screen, { perfilUsuario, emailUsuario, nomeUsuario })}
    >
      <MaterialCommunityIcons name={icon} size={40} color={Colors.primary} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.menuGrid}>
        
        {/* 🛡️ REGRAS PARA O ADMINISTRADOR (Vê e faz tudo) */}
        {perfilUsuario === 'Adm' && (
          <>
            {/* Alunos */}
            <MenuCard title="Cadastrar Aluno" icon="account-plus" screen="CadastroAluno" />
            <MenuCard title="Ver Alunos" icon="account-group" screen="ListaAlunos" />

            <MenuCard title="Matricular Aluno" icon="link-variant" screen="MatricularAluno" />
            
            {/* Professores */}
            <MenuCard title="Cadastrar Professor" icon="school" screen="CadastroProfessor" />
            <MenuCard title="Ver Professores" icon="card-account-details" screen="ListaProfessores" />

            {/* Disciplinas */}
            <MenuCard title="Cadastrar Disciplina" icon="book-plus" screen="CadastroDisciplina" />
            <MenuCard title="Ver Disciplinas" icon="book-open-variant" screen="ListaDisciplinas" />
          </>
        )}

        {/* 👨‍🏫 REGRAS PARA O PROFESSOR (Visão restrita) */}
        {perfilUsuario === 'Professor' && (
          <>
            <MenuCard title="Minhas Disciplinas" icon="book-open-variant" screen="ListaDisciplinas" />
            <MenuCard title="Lançar Notas" icon="notebook-edit" screen="LancamentoNotas" />
            <MenuCard title="Ver Notas Lançadas" icon="file-document-multiple" screen="VisualizarNotas" />
          </>
        )}

        {/* 👨‍🎓 REGRAS PARA O ALUNO */}
        {perfilUsuario === 'Aluno' && (
          <>
            <MenuCard title="Ver Minhas Notas" icon="file-certificate" screen="Boletim" />
            <MenuCard title="Grade & Professores" icon="account-group" screen="MinhaGrade" />
          </>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' }, 
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
  cardText: { marginTop: 10, fontSize: 14, fontWeight: '600', color: '#fff' }, 
  logoutButton: { margin: 20, padding: 15, alignItems: 'center', borderRadius: 10, backgroundColor: '#fee' },
  logoutText: { color: 'red', fontWeight: 'bold' },
  cardAdmin: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    marginTop: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 13, color: '#777', marginTop: 5 }
});