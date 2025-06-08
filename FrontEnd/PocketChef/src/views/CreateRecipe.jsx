import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe } from '../services/recipes';

export default function CreateRecipe() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (fields) => {
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
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  return (
    <RecipeForm
      title="Crear Receta"
      onSubmit={handleCreate}
      loading={loading}
      submitLabel="Crear receta"
    />
  );
}
