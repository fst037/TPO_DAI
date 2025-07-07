
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import StepForm from '../components/recipe/StepForm';
import { getRecipeById, updateStepInRecipe } from '../services/recipes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, stepId } = route.params || {};
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [savedItemsModalVisible, setSavedItemsModalVisible] = useState(false);
  const [savedItems, setSavedItems] = useState([]);


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

  // Unique AsyncStorage key for edit step
  const STORAGE_KEY = `@PocketChef:editStep:${recipeId}:${stepId}`;

  // Load saved items for this edit step
  const loadSavedItems = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedItems([JSON.parse(raw)]);
      } else {
        setSavedItems([]);
      }
    } catch (e) {
      setSavedItems([]);
    }
  }, [STORAGE_KEY]);

  // Open modal and load saved items
  const openSavedItemsModal = () => {
    setSavedItemsModalVisible(true);
    loadSavedItems();
  };

  // Select a saved item to load into the form
  const handleSelectSavedItem = (item) => {
    setInitialValues({
      ...item,
    });
    setSavedItemsModalVisible(false);
  };

  // Delete saved item
  const handleDeleteSavedItem = async (item) => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSavedItems([]);
    setSavedItemsModalVisible(false);
  };

  // Save for later handler (called from StepForm)
  const handleSaveForLater = async (fields) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
      Alert.alert('Guardado', 'El paso fue guardado para continuar más tarde.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el paso.');
    }
  };

  // Remove saved item after successful upload
  const removeSavedItem = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSavedItems([]);
  };


  // Main submit handler
  const handleSave = async (fields) => {
    setLoading(true);
    try {
      await updateStepInRecipe(recipeId, stepId, fields);
      await removeSavedItem();
      queryClient.invalidateQueries(['recipe', recipeId]);
      navigation.goBack();
    } catch (err) {
      // Optionally show an alert modal here
    }
    setLoading(false);
  };

  if (!initialValues) return null;

  return (
    <>
      <StepForm
        initialValues={initialValues}
        onSubmit={handleSave}
        loading={loading}
        title="Editar Paso"
        submitLabel="Guardar cambios"
        onSaveForLater={handleSaveForLater}
        showSavedItemsModal={savedItemsModalVisible}
        savedItems={savedItems}
        onSelectSavedItem={handleSelectSavedItem}
        onDeleteSavedItem={handleDeleteSavedItem}
        onOpenSavedItemsModal={openSavedItemsModal}
        isEdit
      />
      {/* Top-right folder icon to open saved items modal */}
      <MaterialCommunityIcons
        name="folder"
        size={28}
        color="#333"
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        onPress={openSavedItemsModal}
      />
    </>
  );
}
