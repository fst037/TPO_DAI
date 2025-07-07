import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StepForm from '../components/recipe/StepForm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addStepToRecipe } from '../services/recipes';
import colors from '../theme/colors';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, afterStep } = route.params || {};
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const actuallyCreate = async (fields) => {
    setLoading(true);
    try {
      await addStepToRecipe(recipeId, { ...fields, afterStep });
      setLoading(false);
      queryClient.invalidateQueries(['recipe', recipeId]);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      // Optionally show an alert modal here
    }
  };

  // Get initial values from route params if available
  const initialValues = route?.params?.initialValues || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StepForm
        title="Agregar paso"
        onSubmit={actuallyCreate}
        loading={loading}
        submitLabel="Agregar"
        initialValues={initialValues}
        enableSaveForLater={true}
        saveKey="steps_saved_for_later"
        isEdit={false}
      />
    </View>
  );
}

