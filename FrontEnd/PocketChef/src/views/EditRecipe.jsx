import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { getRecipeById, updateRecipe } from '../services/recipes';

export default function EditRecipe() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setInitialValues({
          recipeName: data.data.recipeName || '',
          recipeDescription: data.data.recipeDescription || '',
          mainPhoto: data.data.mainPhoto || '',
          servings: data.data.servings?.toString() || '',
          numberOfPeople: data.data.numberOfPeople?.toString() || '',
          recipeTypeId: data.data.recipeType?.id?.toString() || '',
          cookingTime: data.data.cookingTime?.toString() || '',
        });
      } catch (err) {
        // Optionally show an alert modal here
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  const handleSave = async (fields) => {
    setLoading(true);
    try {
      await updateRecipe(id, {
        ...fields,
        servings: Number(fields.servings),
        numberOfPeople: Number(fields.numberOfPeople),
        recipeTypeId: Number(fields.recipeTypeId),
        cookingTime: Number(fields.cookingTime),
      });
      navigation.goBack();
    } catch (err) {
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  if (!initialValues) return null;

  return (
    <RecipeForm
      title="Editar Receta"
      initialValues={initialValues}
      onSubmit={handleSave}
      loading={loading}
      submitLabel="Guardar cambios"
    />
  );
}
