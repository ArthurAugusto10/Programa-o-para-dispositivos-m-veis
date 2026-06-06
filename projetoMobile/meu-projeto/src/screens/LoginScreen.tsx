import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { Colors } from '../styles/globalStyles';
import api from '../services/api';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [documento, setDocumento] = useState('');
    const [perfil, setPerfil] = useState<'Aluno' | 'Professor' | 'Adm'>('Aluno');
    const [carregando, setCarregando] = useState(false);

    const handleLogin = async () => {
        if (!email || !senha || !documento) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        setCarregando(true);

        try {
            const response = await api.post('/login', {
                email: email,
                senha: senha,
                documento: documento
            });

            const { token, usuario } = response.data;
            console.log(`Login realizado como ${usuario.perfil}:`, usuario.nome);

            // O perfil retornado pelo banco define o que o usuário verá no Dashboard
            // O perfil retornado pelo banco e o e-mail digitado definem o que o usuário verá no Dashboard
            navigation.navigate('Dashboard', {
                perfilUsuario: usuario.perfil,
                emailUsuario: email,
                nomeUsuario: usuario.nome
                // 🎯 Enviando o e-mail e o nome para o Dashboard rastrear!
            });

        } catch (error: any) {
            console.error('Erro ao acessar:', error);
            const mensagem = error.response?.data?.error || 'Erro ao conectar com o servidor';
            Alert.alert('Falha no Login', mensagem);
        } finally {
            setCarregando(false);
        }
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
                <Text style={styles.subtitle}>Acesso Restrito - Selecione seu perfil:</Text>

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

                {carregando ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                    <CustomButton title="Acessar Sistema" onPress={handleLogin} color={Colors.primary} />
                )}

                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.linkText}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 5 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
    perfilRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    radioContainer: { flexDirection: 'row', alignItems: 'center' },
    radioCircle: { height: 18, width: 18, borderRadius: 9, borderWidth: 2, borderColor: '#007AFF', marginRight: 8 },
    selectedCircle: { backgroundColor: '#007AFF' },
    radioLabel: { fontSize: 14, color: '#444' },
    footerLinks: { alignItems: 'center', marginTop: 20 }, // Centralizado
    linkText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' }
});