import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing } from '../styles/globalStyles';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [documento, setDocumento] = useState('');
    const [perfil, setPerfil] = useState<'Aluno' | 'Professor' | 'Adm'>('Aluno');

    const handleLogin = () => {
        if (!email || !senha || !documento) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }
        console.log(`Login realizado como ${perfil}:`, { email, documento });

        // Navegação para o Dashboard
        navigation.navigate('Dashboard', { perfilUsuario: perfil });
    };

    const RadioButton = ({ label, value }: { label: string, value: typeof perfil }) => (
        <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setPerfil(value)}
        >
            <View style={[styles.radioCircle, perfil === value && styles.selectedCircle]} />
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>App Scholar</Text>
                <Text style={styles.subtitle}>Selecione seu perfil:</Text>

                <View style={styles.perfilRow}>
                    <RadioButton label="Aluno" value="Aluno" />
                    <RadioButton label="Professor" value="Professor" />
                    <RadioButton label="Adm" value="Adm" />
                </View>

                <CustomInput
                    label="E-mail"
                    placeholder="exemplo@fatec.sp.gov.br"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <CustomInput
                    label="Número do Documento (CPF/RA)"
                    placeholder="Digite seu documento"
                    value={documento}
                    onChangeText={setDocumento}
                    keyboardType="numeric"
                />

                <CustomInput
                    label="Senha"
                    placeholder="******"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <CustomButton title="Acessar Sistema" onPress={handleLogin} color={Colors.primary} />


                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>Criar conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: Colors.primary, marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
    perfilRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    radioContainer: { flexDirection: 'row', alignItems: 'center' },
    radioCircle: { height: 18, width: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.primary, marginRight: 8 },
    selectedCircle: { backgroundColor: Colors.primary },
    radioLabel: { fontSize: 14, color: '#444' },
    footerLinks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    linkText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' }
});