import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importação das 6 telas conforme exigido na Parte 1 [cite: 78, 127]
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StudentRegisterScreen from '../screens/StudentRegisterScreen';
import SubjectRegisterScreen from '../screens/SubjectRegisterScreen';
import ReportCardScreen from '../screens/ReportCardScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListaAlunos from '../screens/ListaAlunos';
import CadastroAluno from '../screens/CadastroAluno';
import CadastroProfessor from '../screens/CadastroProfessor';
import ListaProfessores from '../screens/ListaProfessores';
import CadastroDisciplina from '../screens/CadastroDisciplina';
import ListaDisciplinas from '../screens/ListaDisciplinas';
import LancamentoNotas from '../screens/LancamentoNotas';
import VisualizarNotas from '../screens/VisualizarNotas';
import Boletim from '../screens/Boletim';
import MinhaGrade from '../screens/MinhaGrade';
import MatricularAluno from '../screens/MatricularAluno';


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
        {/* 1. Tela de Login  */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* 2. Tela Inicial (Dashboard)  */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'App Scholar - Início' }}
        />

        {/* 3. Tela de Cadastro de Alunos  */}
        <Stack.Screen
          name="CadastroAlunos"
          component={StudentRegisterScreen}
          options={{ title: 'Cadastrar Aluno' }}
        />


        {/* 5. Tela de Cadastro de Disciplinas */}
        <Stack.Screen
          name="CadastroDisciplinas"
          component={SubjectRegisterScreen}
          options={{ title: 'Nova Disciplina' }}
        />

        {/* 6. Tela de Visualização de Boletim */}
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
        <Stack.Screen
          name="CadastroAluno"
          component={CadastroAluno}
          options={{ title: 'Novo Aluno' }} />

        <Stack.Screen
          name="ListaAlunos"
          component={ListaAlunos}
          options={{ title: 'Alunos' }} />

        <Stack.Screen
          name="CadastroProfessor"
          component={CadastroProfessor} />

        <Stack.Screen
          name="ListaProfessores"
          component={ListaProfessores} />

        <Stack.Screen
          name="CadastroDisciplina"
          component={CadastroDisciplina} />

        <Stack.Screen
          name="ListaDisciplinas"
          component={ListaDisciplinas} />

        <Stack.Screen 
          name="LancamentoNotas"
          component={LancamentoNotas} />

        <Stack.Screen 
          name="VisualizarNotas" 
          component={VisualizarNotas} />
 
        <Stack.Screen 
        name="Boletim" 
        component={Boletim} 
        options={{ title: 'Meu Boletim' }} />

        <Stack.Screen
        name="MinhaGrade" 
        component={MinhaGrade} />

       <Stack.Screen 
       name="MatricularAluno" 
       component={MatricularAluno} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}