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
import Recipes from '../views/Recipes';
import Curso from '../views/Curso';
import SeeReviews from '../views/SeeReviews';
import PostReview from '../views/PostReview';
import UpgradePrompt from '../views/UpgradePrompt';
import AddCard from '../views/AddCard';
import MyCards from '../views/MyCards';
import ScanDNI from '../views/ScanDNI'; 
import StudentRegister from '../views/StudentRegister';
import TramiteNumber from '../views/TramiteNumber';
import StudentRegisterWarning from '../views/StudentRegisterWarning';
import BookMarks from '../views/BookMarks';
import RecipeOffline from '../views/RecipeOffline';
import Courses from '../views/Courses';
import StudentCourses from '../views/StudentCourses';
import DropOutCourse from '../views/DropOutCourse';
import QRScan from '../views/QRScan';
import Attendance from '../views/Attendance';
import ConfirmEnrollment from '../views/ConfirmEnrollment';


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
        <Stack.Screen name="RecipeOffline" component={RecipeOffline} />
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
        <Stack.Screen name="Recipes">
          {props => (
            <MainLayout activeTab={0}>
              <Recipes {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="BookMarkedRecipes">
          {props => (
            <MainLayout activeTab={3}>
              <BookMarks {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Courses">
          {props => (
            <MainLayout activeTab={0}>
              <Courses {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="StudentCourses">
          {props => (
            <MainLayout activeTab={1}>
              <StudentCourses {...props} />
            </MainLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="QRScan" component={QRScan} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="Curso" component={Curso} />
        <Stack.Screen name="ConfirmEnrollment" component={ConfirmEnrollment} />
        <Stack.Screen name="SeeReviews" component={SeeReviews} />
        <Stack.Screen name="PostReview" component={PostReview} />
        <Stack.Screen name="UpgradePrompt" component={UpgradePrompt} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="MyCards" component={MyCards} />
        
        <Stack.Screen name="ScanDNI" component={ScanDNI} />
        <Stack.Screen name="TramiteNumber" component={TramiteNumber} />
        <Stack.Screen name="StudentRegisterWarning" component={StudentRegisterWarning} />
        <Stack.Screen name="StudentRegister" component={StudentRegister} />
        <Stack.Screen name="DropOutCourse" component={DropOutCourse} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}