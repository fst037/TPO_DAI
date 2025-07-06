import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe, isRecipeNameAvailable, deleteRecipe, getRecipeById } from '../services/recipes';
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
  

  // Helper to prompt user for conflict resolution
  const [conflictModal, setConflictModal] = useState({ visible: false, existingRecipeId: null, newFields: null });

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

  // Handle recipe name conflict
  const handleConflictChoice = async (choice) => {
    if (choice === 'deleteAndCreate' && conflictModal.existingRecipeId && conflictModal.newFields) {
      setLoading(true);
      try {
        await deleteRecipe(conflictModal.existingRecipeId);
        await actuallyCreate(conflictModal.newFields);        
        setConflictModal({ visible: false, existingRecipeId: null, newFields: null });
      } catch (e) {
        // Optionally show error
      }
      setLoading(false);
    } else if (choice === 'editExisting' && conflictModal.existingRecipeId) {
      // Load existing recipe and go to edit page
      try {
        const data = await getRecipeById(conflictModal.existingRecipeId);
        navigation.replace('EditRecipe', { id: conflictModal.existingRecipeId, initialValues: {
          recipeName: data.data.recipeName || '',
          recipeDescription: data.data.recipeDescription || '',
          mainPhoto: data.data.mainPhoto || '',
          servings: data.data.servings?.toString() || '',
          numberOfPeople: data.data.numberOfPeople?.toString() || '',
          recipeTypeId: data.data.recipeType?.id || '',
          cookingTime: data.data.cookingTime?.toString() || '',
        }});
      } catch (e) {
        // Optionally show error
      }
    }
  };

  const handleCreate = async (fields) => {
    // Check if recipe name is available
    setLoading(true);
    try {
      const res = await isRecipeNameAvailable(fields.recipeName);
      if (res?.data?.available) {
        actuallyCreate(fields);
      } else {
        // Not available, prompt user
        setConflictModal({ visible: true, existingRecipeId: res.data.id, newFields: fields });
      }
    } catch (e) {
      // Optionally show error
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
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
      {/* Conflict modal */}
      <ConfirmationModal
        visible={conflictModal.visible}
        title="Nombre de receta ya existe"
        message="¿Deseas eliminar la receta existente y reemplazarla, o editar la existente?"
        confirmText="Eliminar y reemplazarla"
        cancelText="Editar existente"
        onConfirm={() => handleConflictChoice('deleteAndCreate')}
        onCancel={() => handleConflictChoice('editExisting')}
      />
    </View>
  );
}
