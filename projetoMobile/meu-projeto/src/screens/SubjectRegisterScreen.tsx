import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';

export default function SubjectRegisterScreen({ route }: any) {
  const { perfilUsuario } = route.params || { perfilUsuario: 'Aluno' };
  const eAdm = perfilUsuario === 'Adm';

  // Dados simulados com os campos solicitados
  const disciplinasMock = [
    { 
      id: '1', 
      nome: 'Desenvolvimento de Software Multiplataforma', 
      cargaHoraria: '80h', 
      professorResponsavel: 'André Olímpio',
      curso: 'DSM',
      semestre: '4º Semestre'
    },
    { 
      id: '2', 
      nome: 'Estrutura de Dados', 
      cargaHoraria: '40h', 
      professorResponsavel: 'Carlos Silva',
      curso: 'DSM',
      semestre: '3º Semestre'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eAdm ? "GERENCIAR DISCIPLINAS" : "GRADE DE DISCIPLINAS"}
      </Text>

      {eAdm ? (
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>[ CADASTRO DE DISCIPLINA ]</Text>
          
          <CustomInput label="NOME DA DISCIPLINA" placeholder="Ex: Programação Mobile" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="CARGA HORÁRIA" placeholder="Ex: 80h" keyboardType="numeric" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="PROFESSOR RESPONSÁVEL" placeholder="Nome do docente" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="CURSO" placeholder="Ex: DSM, GE, Logística" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />
          <CustomInput label="SEMESTRE" placeholder="Ex: 4º Semestre" value={''} onChangeText={function (text: string): void {
            throw new Error('Function not implemented.');
          } } />

          <CustomButton title="SALVAR DISCIPLINA" onPress={() => {}} color={Colors.primary} />
          <View style={{ height: 30 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={disciplinasMock}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{item.nome.toUpperCase()}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.cargaHoraria}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DOCENTE:</Text>
                <Text style={styles.infoValue}>{item.professorResponsavel}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CURSO:</Text>
                <Text style={styles.infoValue}>{item.curso}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PERÍODO:</Text>
                <Text style={styles.infoValue}>{item.semestre}</Text>
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
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#888', marginBottom: 15 },
  formContainer: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  cardName: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  badge: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, borderWidth: 1, borderColor: Colors.primary },
  badgeText: { color: Colors.primary, fontSize: 10, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', marginTop: 6 },
  infoLabel: { fontSize: 10, color: '#999', width: 90, fontWeight: 'bold' },
  infoValue: { fontSize: 12, color: '#444', flex: 1, fontWeight: '500' }
});