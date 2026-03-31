import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useForm } from '../hooks/useForm';
import { Colors, Spacing } from '../styles/globalStyles';

export default function StudentRegisterScreen() {
  // Inicializando o formulário com os campos obrigatórios do PDF [cite: 101, 102, 103, 104, 105, 106, 107, 108, 111, 112]
  const { values, handleChange } = useForm({
    nome: '',
    matricula: '',
    curso: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: ''
  });

  const handleSave = () => {
    // Validação de campos obrigatórios [cite: 51]
    if (!values.nome || !values.matricula || !values.email) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios (Nome, Matrícula e Email).");
      return;
    }

    // Exibição dos dados conforme permitido na Parte 1 [cite: 113]
    console.log("Cadastro de Aluno realizado:", values);
    Alert.alert("Sucesso", "Dados do aluno salvos temporariamente!");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Informações Acadêmicas</Text>
      
      <CustomInput 
        label="Nome Completo" 
        placeholder="Digite o nome do aluno" 
        value={values.nome} 
        onChangeText={(text) => handleChange('nome', text)} 
      />
      
      <CustomInput 
        label="Matrícula" 
        placeholder="Ex: 123456" 
        value={values.matricula} 
        onChangeText={(text) => handleChange('matricula', text)} 
        keyboardType="numeric" 
      />

      <CustomInput 
        label="Curso" 
        placeholder="Ex: DSM - Fatec Jacareí" 
        value={values.curso} 
        onChangeText={(text) => handleChange('curso', text)} 
      />

      <Text style={styles.sectionTitle}>Contato e Localização</Text>

      <CustomInput 
        label="E-mail" 
        placeholder="aluno@fatec.sp.gov.br" 
        value={values.email} 
        onChangeText={(text) => handleChange('email', text)} 
        keyboardType="email-address" 
      />

      <CustomInput 
        label="CEP" 
        placeholder="00000-000" 
        value={values.cep} 
        onChangeText={(text) => handleChange('cep', text)} 
        keyboardType="numeric" 
      />

      {/* Botão padronizado utilizando nosso componente global  */}
      <CustomButton 
        title="Salvar Cadastro" 
        onPress={handleSave} 
        color={Colors.success} 
      />
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: Spacing.padding, 
    backgroundColor: Colors.background 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    marginBottom: 15, 
    marginTop: 10 
  }
});