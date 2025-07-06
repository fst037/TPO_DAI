import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import RecipeForm from '../components/recipe/RecipeForm';
import { createRecipe } from '../services/recipes';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';


export default function CreateRecipe({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Get initial values from route params if available
  const initialValues = route?.params?.initialValues || {};

  // Load saved recipes when opening the list
  const openSavedList = async () => {
    try {
      const key = 'recipes_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      console.log(`Loading saved recipes from storage: ${existing}`);
      
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedRecipes(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedRecipes([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (recipe) => {
    setShowSavedList(false);
    if (recipe) {
      // Ensure numbers are strings for form fields
      const initialValues = {
        ...recipe,
        servings: recipe.servings != null ? recipe.servings.toString() : '',
        numberOfPeople: recipe.numberOfPeople != null ? recipe.numberOfPeople.toString() : '',
        cookingTime: recipe.cookingTime != null ? recipe.cookingTime.toString() : '',
      };
      navigation.replace('CreateRecipe', { initialValues });
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      const key = 'recipes_saved_for_later';
      let arr = [...savedRecipes];
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      setSavedRecipes(arr);
    } catch (e) {}
  };

  const actuallyCreate = async (fields) => {
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
      console.log('Error creating recipe:', err);  
    }
    setLoading(false);
  };

  const handleCreate = async (fields) => {
    // Check network type
    const state = await NetInfo.fetch();
    if (state.type === 'wifi') {
      actuallyCreate(fields);
    } else {
      setPendingFields(fields);
      setShowConfirm(true);
    }
  };

  const handleConfirmProceed = () => {
    setShowConfirm(false);
    if (pendingFields) {
      actuallyCreate(pendingFields);
      setPendingFields(null);
    }
  };

  const handleSaveForLater = async () => {
    // Save the recipe fields locally for later creation
    try {
      const key = 'recipes_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      if (pendingFields) {
        arr.push(pendingFields);
        await AsyncStorage.setItem(key, JSON.stringify(arr));
      }

      navigation.goBack();
    } catch (e) {
      // Optionally handle error
    }
    setShowConfirm(false);
    setPendingFields(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Saved recipes icon */}
      <TouchableOpacity
        style={styles.savedIcon}
        onPress={openSavedList}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="list" size={32} color="#333" />
      </TouchableOpacity>

      <RecipeForm
        title="Crear Receta"
        onSubmit={handleCreate}
        initialValues={initialValues}
        loading={loading}
        submitLabel="Crear receta"
      />

      <ConfirmationModal
        visible={showConfirm}
        title="Red de datos detectada"
        message="No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar la receta para crearla más tarde?"
        confirmText="Continuar"
        cancelText="Posponer"
        onConfirm={handleConfirmProceed}
        onCancel={handleSaveForLater}
      />

      {/* Saved recipes list modal */}
      {showSavedList && (
        <View style={styles.savedListOverlay}>
          <View style={styles.savedListModal}>
            <Text style={styles.savedListTitle}>Recetas guardadas</Text>
            {savedRecipes.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay recetas guardadas.</Text>
            ) : (
              <FlatList
                data={savedRecipes}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.savedItemRow}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                      <Text numberOfLines={1} style={styles.savedItemText}>{item.recipeName || 'Sin nombre'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteSaved(index)}>
                      <MaterialIcons name="delete" size={22} color="#c00" />
                    </TouchableOpacity>
                  </View>
                )}
                style={{ maxHeight: 300 }}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSavedList(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  savedIcon: {
    position: 'absolute',
    bottom: 32,
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
