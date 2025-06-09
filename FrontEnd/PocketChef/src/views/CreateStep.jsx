import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StepForm from '../components/recipe/StepForm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addStepToRecipe } from '../services/recipes';
import AlertModal from '../components/global/modals/AlertModal';
import colors from '../theme/colors';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, afterStep } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();

  const handleSubmit = async (fields) => {
    setLoading(true);
    try {
      await addStepToRecipe(recipeId, { ...fields, afterStep });
      setLoading(false);
      queryClient.invalidateQueries(['recipe', recipeId]);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo agregar el paso.' });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StepForm
        title="Agregar paso"
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Agregar"
      />
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onRequestClose={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
}
