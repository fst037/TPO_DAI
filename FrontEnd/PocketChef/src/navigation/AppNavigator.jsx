import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../views/Home';
import Register from '../views/Register';
import Login from '../views/Login';
import VerifyCode from '../views/VerifyCode';
import Profile from '../views/Profile';
import ForgotPassword from '../views/ForgotPassword';
import ResetPassword from '../views/ResetPassword';
import EditProfile from '../views/EditProfile';
import UserOptions from '../views/UserOptions';
import MainLayout from '../components/global/MainLayout';
import TechSupport from '../views/TechSupport';
import TermsAndConditions from '../views/TermsAndConditions';
import Recipe from '../views/Recipe';
import AddRecipePhoto from '../views/AddRecipePhoto';
import EditRecipe from '../views/EditRecipe';
import CreateRecipe from '../views/CreateRecipe';
import EditStep from '../views/EditStep';
import CreateStep from '../views/CreateStep';
import EditIngredient from '../views/EditIngredient';
import CreateIngredient from '../views/CreateIngredient';
import AddStepMultimedia from '../views/AddStepMultimedia';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => (
            <MainLayout activeTab={0}>
              <Home {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="Profile">
          {props => (
            <MainLayout activeTab={4}>
              <Profile {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Recipe" component={Recipe} />
        <Stack.Screen name="AddRecipePhoto" component={AddRecipePhoto} />
        <Stack.Screen name="AddStepMultimedia" component={AddStepMultimedia} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="UserOptions" component={UserOptions} />
        <Stack.Screen name="TechSupport" component={TechSupport} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="EditRecipe" component={EditRecipe} />
        <Stack.Screen name="CreateRecipe">
          {props => (
            <MainLayout activeTab={2}>
              <CreateRecipe {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="EditStep" component={EditStep} />
        <Stack.Screen name="CreateStep" component={CreateStep} />
        <Stack.Screen name="EditIngredient" component={EditIngredient} />
        <Stack.Screen name="CreateIngredient" component={CreateIngredient} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}