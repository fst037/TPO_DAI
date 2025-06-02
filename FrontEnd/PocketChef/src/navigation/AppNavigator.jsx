import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../views/Home';
import Register from '../views/Register';
import Login from '../views/Login';
import VerifyCode from '../views/VerifyCode';
import Profile from '../views/Profile';
import ForgotPassword from '../views/ForgotPassword';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}