import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe } from '../services/recipes';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';


export default function CreateRecipe({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Get initial values from route params if available
  const initialValues = route?.params?.initialValues || {};

  // Load saved recipes when opening the list
  const openSavedList = async () => {
    try {
      const key = 'recipes_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      console.log(`Loading saved recipes from storage: ${existing}`);
      
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedRecipes(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedRecipes([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (recipe) => {
    setShowSavedList(false);
    if (recipe) {
      // Ensure numbers are strings for form fields
      const initialValues = {
        ...recipe,
        servings: recipe.servings != null ? recipe.servings.toString() : '',
        numberOfPeople: recipe.numberOfPeople != null ? recipe.numberOfPeople.toString() : '',
        cookingTime: recipe.cookingTime != null ? recipe.cookingTime.toString() : '',
      };
      navigation.replace('CreateRecipe', { initialValues });
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      const key = 'recipes_saved_for_later';
      let arr = [...savedRecipes];
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      setSavedRecipes(arr);
    } catch (e) {}
  };

  const actuallyCreate = async (fields) => {
    setLoading(true);
    try {
      const newRecipe = await createRecipe({
        ...fields,
        servings: Number(fields.servings),
        numberOfPeople: Number(fields.numberOfPeople),
        recipeTypeId: Number(fields.recipeTypeId),
        cookingTime: Number(fields.cookingTime),
      });
      navigation.replace('Recipe', { id: newRecipe.data.id });
    } catch (err) {
      console.log('Error creating recipe:', err);  
    }
    setLoading(false);
  };

  const handleCreate = async (fields) => {
    // Check network type
    const state = await NetInfo.fetch();
    if (state.type === 'wifi') {
      actuallyCreate(fields);
    } else {
      setPendingFields(fields);
      setShowConfirm(true);
    }
  };

  const handleConfirmProceed = () => {
    setShowConfirm(false);
    if (pendingFields) {
      actuallyCreate(pendingFields);
      setPendingFields(null);
    }
  };

  const handleSaveForLater = async () => {
    // Save the recipe fields locally for later creation
    try {
      const key = 'recipes_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      if (pendingFields) {
        arr.push(pendingFields);
        await AsyncStorage.setItem(key, JSON.stringify(arr));
      }

      navigation.goBack();
    } catch (e) {
      // Optionally handle error
    }
    setShowConfirm(false);
    setPendingFields(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Saved recipes icon */}
      <RecipeForm
        title="Crear Receta"
        onSubmit={handleCreate}
        initialValues={initialValues}
        loading={loading}
        submitLabel="Crear receta"
        enableSaveForLater={true}
        saveKey="recipes_saved_for_later"
        isEdit={false}
      />
    </View>
  );
}
