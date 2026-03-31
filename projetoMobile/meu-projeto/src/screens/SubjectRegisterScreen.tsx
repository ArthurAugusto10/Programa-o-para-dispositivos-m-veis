import React from 'react';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useForm } from '../hooks/useForm';
import { Colors, Spacing } from '../styles/globalStyles';

export default function SubjectRegisterScreen() {
  const { values, handleChange } = useForm({
    nomeDisciplina: '',
    cargaHoraria: '',
    professorResponsavel: '',
    curso: '',
    semestre: ''
  });

  const handleSave = () => {
    if (!values.nomeDisciplina || !values.curso) {
      Alert.alert("Erro", "O nome da disciplina e o curso são obrigatórios.");
      return;
    }

    console.log("Disciplina cadastrada:", values); // Dados temporários [cite: 64, 113]
    Alert.alert("Sucesso", "Disciplina registrada no sistema!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nova Disciplina</Text>

      <CustomInput 
        label="Nome da Disciplina" 
        placeholder="Ex: Programação para Dispositivos Móveis I" 
        value={values.nomeDisciplina} 
        onChangeText={(text) => handleChange('nomeDisciplina', text)} 
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <CustomInput 
            label="Carga Horária" 
            placeholder="Ex: 80" 
            value={values.cargaHoraria} 
            onChangeText={(text) => handleChange('cargaHoraria', text)} 
            keyboardType="numeric" 
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput 
            label="Semestre" 
            placeholder="Ex: 5" 
            value={values.semestre} 
            onChangeText={(text) => handleChange('semestre', text)} 
            keyboardType="numeric" 
          />
        </View>
      </View>

      <CustomInput 
        label="Professor Responsável" 
        placeholder="Selecione o professor" 
        value={values.professorResponsavel} 
        onChangeText={(text) => handleChange('professorResponsavel', text)} 
      />

      <CustomInput 
        label="Curso" 
        placeholder="Ex: DSM" 
        value={values.curso} 
        onChangeText={(text) => handleChange('curso', text)} 
      />

      <CustomButton title="Salvar Disciplina" onPress={handleSave} color={Colors.secondary} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.padding, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 20 },
  row: { flexDirection: 'row' }
});