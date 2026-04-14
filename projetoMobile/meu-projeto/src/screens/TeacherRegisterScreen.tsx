import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';

export default function TeacherRegisterScreen({ route }: any) {
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  const eAdm = perfilUsuario === 'Adm';

  // Dados simulados atualizados
  const professoresMock = [
    { 
      id: '1', 
      nome: 'André Olímpio', 
      titulacao: 'Mestre', 
      areaAtuacao: 'Desenvolvimento Mobile / Web', 
      tempoDocencia: '10 anos',
      email: 'andre.olimpio@fatec.sp.gov.br',
      cep: '12223-450',
      endereco: 'Av. Dra. Ruth Cardoso, 000',
      cidade: 'São José dos Campos',
      estado: 'SP'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eAdm ? "GERENCIAR CORPO DOCENTE" : "CONSULTA DE PROFESSORES"}
      </Text>

      {eAdm ? (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>[ DADOS ACADÊMICOS ]</Text>
          <CustomInput label="NOME COMPLETO" placeholder="Nome do docente" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="TITULAÇÃO" placeholder="Ex: Mestre, Doutor" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="ÁREA DE ATUAÇÃO" placeholder="Ex: Programação" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="TEMPO DE DOCÊNCIA" placeholder="Ex: 5 anos" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="E-MAIL INSTITUCIONAL" placeholder="email@fatec.sp.gov.br" keyboardType="email-address" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>[ LOCALIZAÇÃO ]</Text>
          <CustomInput label="CEP" placeholder="00000-000" keyboardType="numeric" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="LOGRADOURO" placeholder="Rua, Número, Bairro" value={''} onChangeText={function (text: string): void {
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

          <CustomButton title="CADASTRAR PROFESSOR" onPress={() => {}} color={Colors.primary} />
          <View style={{ height: 30 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={professoresMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{item.nome.toUpperCase()}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.titulacao}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ÁREA:</Text>
                <Text style={styles.infoValue}>{item.areaAtuacao}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CONTATO:</Text>
                <Text style={styles.infoValue}>{item.email}</Text>
              </View>

              <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>ENDEREÇO:</Text>
    <Text style={styles.infoValue}>{item.endereco}</Text>
  </View>

              {/* Novos campos de localização no card */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>LOCALIDADE:</Text>
                <Text style={styles.infoValue}>{item.cidade} - {item.estado}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CEP:</Text>
                <Text style={styles.infoValue}>{item.cep}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TEMPO DE DOCENCIA:</Text>
                <Text style={styles.infoValue}>{item.tempoDocencia}</Text>
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
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#888', marginBottom: 10 },
  formContainer: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  row: { flexDirection: 'row' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1 },
  badge: { backgroundColor: '#e8f5e9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#4caf50' },
  badgeText: { color: '#2e7d32', fontSize: 9, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginTop: 5 },
  infoLabel: { fontSize: 10, color: '#999', width: 85, fontWeight: 'bold' },
  infoValue: { fontSize: 12, color: '#444', flex: 1 }
});