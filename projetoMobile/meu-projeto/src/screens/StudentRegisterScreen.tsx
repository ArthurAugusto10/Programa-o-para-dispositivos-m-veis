import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing } from '../styles/globalStyles';

export default function StudentRegisterScreen({ route }: any) {
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  const podeCadastrar = perfilUsuario === 'Adm' || perfilUsuario === 'Professor';

  const alunosMock = [
    { id: '1', nome: 'Arthur Augusto', curso: 'DSM', ra: '123456' },
    { id: '2', nome: 'Mariana Silva', curso: 'DSM', ra: '654321' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {podeCadastrar ? "Gerenciamento de Alunos" : "Meus Colegas de Curso"}
      </Text>

      {podeCadastrar ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomInput label="Nome do Aluno" placeholder="Nome completo" value="" onChangeText={() => {}} />
          <CustomInput label="RA / Matrícula" placeholder="Ex: 0040..." value="" onChangeText={() => {}} keyboardType="numeric" />
          <CustomInput label="Curso" placeholder="Ex: DSM" value="" onChangeText={() => {}} />
          <CustomButton title="Registrar Aluno" onPress={() => {}} color={Colors.primary} />
          
          <Text style={[styles.title, { marginTop: 30 }]}>Alunos Cadastrados</Text>
          {alunosMock.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>RA: {item.ra} | Curso: {item.curso}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <FlatList 
          data={alunosMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>Curso: {item.curso}</Text>
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
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 14, color: '#666' }
});