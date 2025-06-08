import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import IngredientForm from '../components/recipe/IngredientForm';
import { addIngredientToRecipe } from '../services/recipes';
import { getAllUnits } from '../services/units';
import { getAllIngredients } from '../services/ingredients';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateIngredient() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      const unitsRes = await getAllUnits();
      setUnits(unitsRes.data.map(u => ({ label: u.abbreviation, value: u.id.toString() })));
      const ingredientsRes = await getAllIngredients();
      setIngredientOptions(ingredientsRes.data.map(i => ({ label: i.name, value: i.id.toString() })));
    };
    fetchData();
  }, []);

  const handleCreate = async (fields) => {
    setLoading(true);
    try {
      await addIngredientToRecipe(recipeId, {
        quantity: Number(fields.quantity),
        unitId: Number(fields.unitId),
        ingredientId: Number(fields.ingredientId),
        observations: fields.observations || '',
      });
      queryClient.invalidateQueries(['recipe', recipeId]);
      navigation.goBack();
    } catch (err) {
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  return (
    <IngredientForm
      title="Agregar Ingrediente"
      onSubmit={handleCreate}
      loading={loading}
      submitLabel="Agregar ingrediente"
      units={units}
      ingredientOptions={ingredientOptions}
    />
  );
}
