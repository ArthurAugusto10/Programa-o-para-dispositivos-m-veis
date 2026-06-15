import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';

export default function StudentRegisterScreen({ route }: any) {
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  const eAdm = perfilUsuario === 'Adm';

  // Dados simulados com os novos campos
  const alunosMock = [
    { 
      id: '1', 
      nome: 'Arthur Augusto', 
      matricula: '2024001', 
      curso: 'DSM', 
      email: 'arthur@fatec.sp.gov.br',
      telefone: '(12) 99999-8888',
      endereco: 'Rua xxxxxx',
      cidade: 'Jacareí',
      estado: 'SP',
      cep: '11221'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eAdm ? "CADASTRO DE DISCENTE" : "CONSULTA DE ALUNOS"}
      </Text>

      {eAdm ? (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>[ DADOS PESSOAIS ]</Text>
          <CustomInput label="NOME COMPLETO" placeholder="Nome do aluno" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="MATRÍCULA" placeholder="Ex: 2026001" keyboardType="numeric" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="CURSO" placeholder="Ex: DSM ou GE" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="E-MAIL" placeholder="email@fatec.sp.gov.br" keyboardType="email-address" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="TELEFONE" placeholder="(00) 00000-0000" keyboardType="phone-pad" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="CEP" placeholder="Ex: 12223" keyboardType="numeric" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="ENDERECO" placeholder="Rua xxxxx" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>[ ENDEREÇO ]</Text>
          <CustomInput label="CEP" placeholder="00000-000" keyboardType="numeric" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="ENDEREÇO" placeholder="Rua, Número, Bairro" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <CustomInput label="CIDADE" placeholder="Ex: Jacareí" value={''} onChangeText={function (text: string): void {
                throw new Error('Function not implemented.');
              } } />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput label="ESTADO" placeholder="SP" value={''} onChangeText={function (text: string): void {
                throw new Error('Function not implemented.');
              } } />
            </View>
    
          </View>

          <CustomButton title="SALVAR ALUNO" onPress={() => {}} color={Colors.primary} />
          <View style={{ height: 30 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={alunosMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{item.nome}</Text>
                <Text style={styles.badge}>{item.matricula}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Curso:</Text>
                <Text style={styles.infoValue}>{item.curso}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contato:</Text>
                <Text style={styles.infoValue}>{item.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Localização:</Text>
                <Text style={styles.infoValue}>{item.cidade} - {item.estado}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Matricula:</Text>
                <Text style={styles.infoValue}>{item.matricula}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefone:</Text>
                <Text style={styles.infoValue}>{item.telefone}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CEP:</Text>
                <Text style={styles.infoValue}>{item.cep}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ENDEREÇO:</Text>
                <Text style={styles.infoValue}>{item.endereco}</Text>
              </View>

            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: Colors.primary },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 10 },
  formContainer: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  row: { flexDirection: 'row' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  badge: { backgroundColor: Colors.primary, color: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontSize: 10, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginTop: 5 },
  infoLabel: { fontSize: 12, color: '#888', width: 80 },
  infoValue: { fontSize: 12, color: '#333', fontWeight: '500' }
});