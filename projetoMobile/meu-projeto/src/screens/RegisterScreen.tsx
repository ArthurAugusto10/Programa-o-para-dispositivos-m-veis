import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = () => {
    if (!nome || !documento || !email || !senha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    Alert.alert("Solicitação Enviada", "Seu pré-cadastro foi realizado. Aguarde a liberação do Administrador.");
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Novo Cadastro</Text>
        
        <CustomInput label="Nome Completo" placeholder="Como deseja ser chamado" value={nome} onChangeText={setNome} />
        <CustomInput label="Documento (RA ou CPF)" placeholder="Digite os números" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
        <CustomInput label="E-mail" placeholder="fatec.sp.gov.br" value={email} onChangeText={setEmail} />
        <CustomInput label="Senha" placeholder="Crie uma senha forte" value={senha} onChangeText={setSenha} secureTextEntry />
        
        <View style={{ marginTop: 10 }}>
          <CustomButton title="Finalizar Cadastro" onPress={handleRegister} color={Colors.success} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.primary, marginBottom: 20, textAlign: 'center' },
  backLink: { textAlign: 'center', color: '#666', marginTop: 15, fontSize: 14 }
});