import React, { useState } from 'react';
import { View } from 'react-native';
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

const styles = StyleSheet.create({
  savedIcon: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedListOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  savedListModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'stretch',
    elevation: 8,
  },
  savedListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  savedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  savedItemText: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
