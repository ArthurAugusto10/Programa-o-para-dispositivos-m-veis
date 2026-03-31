import React from 'react';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useForm } from '../hooks/useForm';
import { Colors, Spacing } from '../styles/globalStyles';

export default function TeacherRegisterScreen() {
  const { values, handleChange } = useForm({
    nome: '',
    titulacao: '',
    areaAtuacao: '',
    tempoDocencia: '',
    email: ''
  });

  const handleSave = () => {
    // Validação de campos obrigatórios [cite: 51]
    if (!values.nome || !values.titulacao || !values.areaAtuacao || !values.email) {
      Alert.alert("Erro", "Por favor, preencha todos os campos do docente.");
      return;
    }

    console.log("Professor cadastrado:", values); // Dados simulados [cite: 113]
    Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dados do Docente</Text>

      <CustomInput 
        label="Nome Completo" 
        placeholder="Ex: André Olímpio" 
        value={values.nome} 
        onChangeText={(text) => handleChange('nome', text)} 
      />

      <CustomInput 
        label="Titulação" 
        placeholder="Ex: Mestre em Computação" 
        value={values.titulacao} 
        onChangeText={(text) => handleChange('titulacao', text)} 
      />

      <CustomInput 
        label="Área de Atuação" 
        placeholder="Ex: Mobile / Backend" 
        value={values.areaAtuacao} 
        onChangeText={(text) => handleChange('areaAtuacao', text)} 
      />

      <CustomInput 
        label="Tempo de Docência (anos)" 
        placeholder="Ex: 5" 
        value={values.tempoDocencia} 
        onChangeText={(text) => handleChange('tempoDocencia', text)} 
        keyboardType="numeric" 
      />

      <CustomInput 
        label="E-mail Institucional" 
        placeholder="email@fatec.sp.gov.br" 
        value={values.email} 
        onChangeText={(text) => handleChange('email', text)} 
        keyboardType="email-address" 
      />

      <CustomButton title="Cadastrar Professor" onPress={handleSave} color={Colors.primary} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.padding, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 20 }
});