import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Biblioteca de ícones inclusa no Expo

export default function DashboardScreen({ navigation }: any) {
  
  // Função auxiliar para renderizar os cards de menu
  const MenuCard = ({ title, icon, screen }: { title: string, icon: any, screen: string }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate(screen)}
    >
      <MaterialCommunityIcons name={icon} size={40} color="#007AFF" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo ao App Scholar</Text>
        <Text style={styles.subText}>Selecione uma opção abaixo:</Text>
      </View>

      <View style={styles.menuGrid}>
        <MenuCard title="Alunos" icon="account-education" screen="CadastroAlunos" />
        <MenuCard title="Professores" icon="teach" screen="CadastroProfessores" />
        <MenuCard title="Disciplinas" icon="book-open-variant" screen="CadastroDisciplinas" />
        <MenuCard title="Boletim" icon="file-document-outline" screen="VisualizacaoBoletim" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f2f5' 
  },
  header: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    marginBottom: 10 
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: '#666', marginTop: 5 },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    padding: 15,
    paddingBottom: 50 // Garante espaço extra no final para o scroll funcionar
  },
  card: {
    backgroundColor: '#fff',
    width: '48%', // Ajustado para evitar quebra errada
    height: 150,  // Definimos uma altura fixa para teste
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardText: { marginTop: 10, fontSize: 14, fontWeight: '600', color: '#444' }
});