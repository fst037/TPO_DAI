import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../views/Home';
import Receta from '../views/Receta';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="Receta" component={Receta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}