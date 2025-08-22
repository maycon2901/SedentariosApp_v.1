import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CadastroScreen from './screens/CadastroScreen';
import TimesScreen from './screens/TimesScreen';
import ProximaScreen from './screens/ProximaScreen';
import { JogadoresProvider } from "./screens/JogadoresContext";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <JogadoresProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Sedentários') {
                return <Ionicons name="people" size={size} color={color} />;
              } else if (route.name === 'Próxima') {
                return <Ionicons name="list" size={size} color={color} />;
              } else if (route.name === 'Times') {
                return <Ionicons name="football" size={size} color={color} />;
              }
              return null;
            },
            tabBarLabelStyle: {
              fontSize: 11,        // 👈 tamanho da letra da aba
              fontFamily: 'fantasy', // opcional: fonte customizada
              fontWeight: 'bold',
            },
            headerTitle: 'SedentáriosApp',
            tabBarActiveTintColor: '#e40b0bff', //Cor do texto, icone Ativo
            tabBarInactiveTintColor: '#fff',  //Cor do texto, icone Inativo
            tabBarStyle: {
              backgroundColor: '#1e1e1e' //Cor de fundo Barra
            },
            headerTitleStyle: {
              fontFamily: 'fantasy',
              fontSize: 25,
              fontWeight: 'bold'
            },
            headerStyle: {
              backgroundColor: "#1e1e1e", //Cor de Header
            },
            headerTintColor: '#e40b0bff', //Texto Header
          })}>
          <Tab.Screen name="Sedentários" component={CadastroScreen} />
          <Tab.Screen name="Próxima" component={ProximaScreen} />
          <Tab.Screen name="Times" component={TimesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </JogadoresProvider>
  );
}

