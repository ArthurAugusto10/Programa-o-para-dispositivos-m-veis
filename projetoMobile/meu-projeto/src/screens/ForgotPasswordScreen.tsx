import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing } from '../styles/globalStyles';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  const handleRecover = () => {
    if (!email) {
      Alert.alert("Erro", "Informe seu e-mail cadastrado.");
      return;
    }
    // Simulação de envio (Parte 1)
    Alert.alert("Sucesso", "Um link de recuperação foi enviado para o seu e-mail.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.instruction}>
          Digite o e-mail associado à sua conta da Fatec para receber as instruções de redefinição.
        </Text>
        <CustomInput 
          label="E-mail Institucional" 
          placeholder="exemplo@fatec.sp.gov.br" 
          value={email} 
          onChangeText={setEmail}
        />
        <CustomButton title="Enviar Link" onPress={handleRecover} color={Colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 4 },
  instruction: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center', lineHeight: 20 }
});