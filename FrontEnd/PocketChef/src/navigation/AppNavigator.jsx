import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../views/Home';
import Register from '../views/Register';
import Login from '../views/Login';
import VerifyCode from '../views/VerifyCode';
import Profile from '../views/Profile';
import ForgotPassword from '../views/ForgotPassword';
import MainLayout from '../components/MainLayout';
import Receta from '../views/Receta';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => (
            <MainLayout activeTab={0} onTabPress={tabIdx => {
              // Navigation logic for tab switching
              if (tabIdx === 0) props.navigation.navigate('Home');
              else if (tabIdx === 4) props.navigation.navigate('Profile');
              // Add more tab navigation as needed
            }}>
              <Home {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="Profile">
          {props => (
            <MainLayout activeTab={4} onTabPress={tabIdx => {
              if (tabIdx === 0) props.navigation.navigate('Home');
              else if (tabIdx === 4) props.navigation.navigate('Profile');
              // Add more tab navigation as needed
            }}>
              <Profile {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}