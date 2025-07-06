import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { getRecipeById, updateRecipe, isRecipeNameAvailable, deleteRecipe } from '../services/recipes';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';

export default function EditRecipe() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id)
        
        setInitialValues({
          recipeName: data.data.recipeName || '',
          recipeDescription: data.data.recipeDescription || '',
          mainPhoto: data.data.mainPhoto || '',
          servings: data.data.servings?.toString() || '',
          numberOfPeople: data.data.numberOfPeople?.toString() || '',
          recipeTypeId: data.data.recipeType?.id|| '',
          cookingTime: data.data.cookingTime?.toString() || '',
        });
      } catch (err) {
        // Optionally show an alert modal here
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  // Helper to prompt user for conflict resolution
  const [conflictModal, setConflictModal] = useState({ visible: false, existingRecipeId: null, newFields: null });

  const actuallyUpdate = async (fields) => {
    setLoading(true);
    try {
      await updateRecipe(id, {
        ...fields,
        servings: Number(fields.servings),
        numberOfPeople: Number(fields.numberOfPeople),
        recipeTypeId: Number(fields.recipeTypeId),
        cookingTime: Number(fields.cookingTime),
      });
      queryClient.invalidateQueries(['recipe', id]);
      navigation.goBack();
    } catch (err) {
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  // Handle recipe name conflict
  const handleConflictChoice = async (choice) => {
    if (choice === 'deleteAndUpdate' && conflictModal.existingRecipeId && conflictModal.newFields) {
      setLoading(true);
      try {
        await deleteRecipe(conflictModal.existingRecipeId);
        await actuallyUpdate(conflictModal.newFields);
        setConflictModal({ visible: false, existingRecipeId: null, newFields: null });
      } catch (e) {
        // Optionally show error
      }
      setLoading(false);
    } else if (choice === 'editExisting' && conflictModal.existingRecipeId) {
      // Load existing recipe and go to edit page
      try {
        const data = await getRecipeById(conflictModal.existingRecipeId);
        navigation.replace('EditRecipe', { id: conflictModal.existingRecipeId });
      } catch (e) {
        // Optionally show error
      }
    }
  };

  const handleSave = async (fields) => {
    setLoading(true);
    try {
      const res = await isRecipeNameAvailable(fields.recipeName);
      if (res?.data?.available || fields.recipeName === initialValues.recipeName) {
        await actuallyUpdate(fields);
      } else {
        // Not available, prompt user
        setConflictModal({ visible: true, existingRecipeId: res.data.id, newFields: fields });
      }
    } catch (e) {
      // Optionally show error
    }
    setLoading(false);
  };

  if (!initialValues) return null;

  return (
    <>
      <RecipeForm
        title="Editar Receta"
        initialValues={initialValues}
        onSubmit={handleSave}
        loading={loading}
        submitLabel="Guardar cambios"
        enableSaveForLater={true}
        saveKey={`recipes_edit_saved_for_later_${id}`}
        isEdit={true}
      />
      {/* Conflict modal */}
      <ConfirmationModal
        visible={conflictModal.visible}
        title="Nombre de receta ya existe"
        message="¿Deseas eliminar la receta existente y reemplazarla, o editar la existente?"
        confirmText="Eliminar y reemplazar"
        cancelText="Editar existente"
        onConfirm={() => handleConflictChoice('deleteAndUpdate')}
        onCancel={() => handleConflictChoice('editExisting')}
      />
    </>
  );
}
