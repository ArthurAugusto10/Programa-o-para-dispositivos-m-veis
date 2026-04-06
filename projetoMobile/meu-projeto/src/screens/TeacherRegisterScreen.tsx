import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing } from '../styles/globalStyles';

export default function TeacherRegisterScreen({ route }: any) {
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  
  // REGRA: Apenas Administrador cadastra professores
  const eAdministrador = perfilUsuario === 'Adm';

  const professoresMock = [
    { id: '1', nome: 'André Olímpio', area: 'Mobile', titulacao: 'Mestre' },
    { id: '2', nome: 'Marta Souza', area: 'Algoritmos', titulacao: 'Doutora' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eAdministrador ? "Gestão de Docentes" : "Corpo Docente Fatec"}
      </Text>

      {eAdministrador ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomInput label="Nome Completo" placeholder="Nome do professor" value="" onChangeText={() => {}} />
          <CustomInput label="Área de Atuação" placeholder="Ex: Engenharia de Software" value="" onChangeText={() => {}} />
          <CustomButton title="Cadastrar Professor" onPress={() => {}} color={Colors.primary} />
          
          <Text style={[styles.title, { marginTop: 30 }]}>Professores Ativos</Text>
          {professoresMock.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>{item.titulacao} | {item.area}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <FlatList 
          data={professoresMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.info}>{item.titulacao} - {item.area}</Text>
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