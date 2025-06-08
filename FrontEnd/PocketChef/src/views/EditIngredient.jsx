import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import IngredientForm from '../components/recipe/IngredientForm';
import { getRecipeById, updateIngredientInRecipe } from '../services/recipes';
import { getAllUnits } from '../services/units';
import { getAllIngredients } from '../services/ingredients';
import { useQueryClient } from '@tanstack/react-query';

export default function EditIngredient() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, ingredient } = route.params || {};
  const ingredientId = ingredient?.idUsedIngredient || ingredient?.id;
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecipeById(recipeId);
        const usedIngredient = (data.data.usedIngredients || []).find(i =>
          i.idUsedIngredient?.toString() === ingredientId?.toString() ||
          i.id?.toString() === ingredientId?.toString()
        );        
        
        const unitsRes = await getAllUnits();
        setUnits(unitsRes.data.map(u => ({ label: u.description, value: u.id })));
        
        const ingredientsRes = await getAllIngredients();
        setIngredientOptions(ingredientsRes.data.map(i => ({ label: i.name, value: i.id })));

        setInitialValues({
          quantity: usedIngredient?.quantity?.toString() || '',
          unitId: usedIngredient?.unitId || usedIngredient?.unitId || '',
          ingredientId: usedIngredient?.ingredientId || usedIngredient?.ingredientId || '',
          observations: usedIngredient?.observations || '',
        });
      } catch (err) {
        // Optionally show an alert modal here
      }
    };
    if (recipeId && ingredientId) fetchData();
  }, [recipeId, ingredientId]);

  const handleSave = async (fields) => {
    setLoading(true);    
    try {
      
      await updateIngredientInRecipe(recipeId, ingredientId, {
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

  if (!initialValues) return null;

  return (
    <IngredientForm
      title="Editar Ingrediente"
      initialValues={initialValues}
      onSubmit={handleSave}
      loading={loading}
      submitLabel="Guardar cambios"
      units={units}
      ingredientOptions={ingredientOptions}
    />
  );
}
