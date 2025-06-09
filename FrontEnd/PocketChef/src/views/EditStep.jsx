import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import StepForm from '../components/recipe/StepForm';
import { getRecipeById, updateStepInRecipe } from '../services/recipes';

export default function EditStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, stepId } = route.params || {};
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchStep = async () => {
      try {
        const data = await getRecipeById(recipeId);
        const step = data.data.steps.find(s => String(s.id) === String(stepId));
        setInitialValues({
          text: step?.text || '',
        });
      } catch (err) {
        // Optionally show an alert modal here
      }
    };
    if (recipeId && stepId) fetchStep();
  }, [recipeId, stepId]);

  const handleSave = async (fields) => {
    setLoading(true);
    try {
      await updateStepInRecipe(recipeId, stepId, fields);
      queryClient.invalidateQueries(['recipe', recipeId]);
      navigation.goBack();
    } catch (err) {
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  if (!initialValues) return null;

  return (
    <StepForm
      initialValues={initialValues}
      onSubmit={handleSave}
      loading={loading}
      title="Editar Paso"
      submitLabel="Guardar cambios"
    />
  );
}
