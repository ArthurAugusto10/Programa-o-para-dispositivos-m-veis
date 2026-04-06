import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing } from '../styles/globalStyles';

export default function SubjectRegisterScreen({ route }: any) {
  // Recebe o perfil vindo do Dashboard
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  
  // Define quem pode cadastrar (Adm e Professor)
  const podeEditar = perfilUsuario === 'Adm' || perfilUsuario === 'Professor';

  // Lista simulada para consulta do aluno
  const disciplinasMock = [
    { id: '1', nome: 'Estrutura de Dados', carga: '80h', professor: 'André Olímpio' },
    { id: '2', nome: 'Interação Humano Computador', carga: '40h', professor: 'Carlos Silva' },
    { id: '3', nome: 'Banco de Dados II', carga: '80h', professor: 'Marta Souza' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {podeEditar ? "Gerenciar Disciplinas" : "Grade Curricular"}
      </Text>

      {podeEditar ? (
        // VISÃO DO ADM / PROFESSOR: Formulário de Cadastro
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomInput label="Nome da Disciplina" placeholder="Ex: Cálculo I" value="" onChangeText={() => {}} />
          <CustomInput label="Carga Horária" placeholder="Ex: 80" value="" onChangeText={() => {}} keyboardType="numeric" />
          <CustomInput label="Professor Responsável" placeholder="Nome do docente" value="" onChangeText={() => {}} />
          <CustomButton title="Salvar Disciplina" onPress={() => {}} color={Colors.success} />
          
          <Text style={[styles.title, { marginTop: 30 }]}>Disciplinas Atuais</Text>
          {disciplinasMock.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>{item.professor} | {item.carga}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        // VISÃO DO ALUNO: Apenas Lista de Consulta
        <FlatList 
          data={disciplinasMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>Prof. {item.professor}</Text>
              <Text style={styles.info}>Carga Horária: {item.carga}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.padding, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: Colors.primary },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#666', marginTop: 2 }
});