import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importação das 6 telas conforme exigido na Parte 1 [cite: 78, 127]
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StudentRegisterScreen from '../screens/StudentRegisterScreen';
import TeacherRegisterScreen from '../screens/TeacherRegisterScreen';
import SubjectRegisterScreen from '../screens/SubjectRegisterScreen';
import ReportCardScreen from '../screens/ReportCardScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      {/* Adicionamos o id="root" para resolver o erro 'Property id is missing' */}
      <Stack.Navigator 
        id="rootStack"
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* 1. Tela de Login [cite: 79] */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* 2. Tela Inicial (Dashboard) [cite: 87] */}
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'App Scholar - Início' }} 
        />

        {/* 3. Tela de Cadastro de Alunos [cite: 100] */}
        <Stack.Screen 
          name="CadastroAlunos" 
          component={StudentRegisterScreen} 
          options={{ title: 'Cadastrar Aluno' }} 
        />

        {/* 4. Tela de Cadastro de Professores [cite: 114] */}
        <Stack.Screen 
          name="CadastroProfessores" 
          component={TeacherRegisterScreen} 
          options={{ title: 'Cadastrar Professor' }} 
        />

        {/* 5. Tela de Cadastro de Disciplinas [cite: 121] */}
        <Stack.Screen 
          name="CadastroDisciplinas" 
          component={SubjectRegisterScreen} 
          options={{ title: 'Nova Disciplina' }} 
        />

        {/* 6. Tela de Visualização de Boletim [cite: 127] */}
        <Stack.Screen 
          name="VisualizacaoBoletim" 
          component={ReportCardScreen} 
          options={{ title: 'Boletim Acadêmico' }} 
        />

        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Recuperar Senha' }}
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Criar Conta' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}