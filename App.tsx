import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CadastroScreen from './screens/CadastroScreen'; // caminho para o arquivo
import TimesScreen from './screens/TimesScreen';
import ProximaScreen from './screens/ProximaScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Sedentários" component={CadastroScreen} />
        <Tab.Screen name="Próxima" component={ProximaScreen} />
        <Tab.Screen name="Times" component={TimesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
