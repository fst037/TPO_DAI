import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation, useRoute } from '@react-navigation/native';
import IngredientForm from '../components/recipe/IngredientForm';
import { addIngredientToRecipe } from '../services/recipes';
import { getAllUnits } from '../services/units';
import { getAllIngredients } from '../services/ingredients';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';

export default function CreateIngredient({ route }) {
  const navigation = useNavigation();
  route = route || {};
  const { recipeId, initialValues: routeInitialValues } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedIngredients, setSavedIngredients] = useState([]);
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Get initial values from route params if available
  const initialValues = routeInitialValues || {};

  useEffect(() => {
    const fetchData = async () => {
      const unitsRes = await getAllUnits();
      setUnits(unitsRes.data.map(u => ({ label: u.description, value: u.id })));
      const ingredientsRes = await getAllIngredients();
      setIngredientOptions(ingredientsRes.data.map(i => ({ label: i.name, value: i.id })));
    };
    fetchData();
  }, []);

  // Load saved ingredients when opening the list
  const openSavedList = async () => {
    try {
      const key = 'ingredients_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedIngredients(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedIngredients([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (ingredient) => {
    setShowSavedList(false);
    if (ingredient) {
      // Ensure numbers are strings for form fields
      const initialValues = {
        ...ingredient,
        quantity: ingredient.quantity != null ? ingredient.quantity.toString() : '',
        unitId: ingredient.unitId != null ? ingredient.unitId.toString() : '',
        ingredientId: ingredient.ingredientId != null ? ingredient.ingredientId.toString() : '',
      };
      navigation.replace('CreateIngredient', { recipeId, initialValues });
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      const key = 'ingredients_saved_for_later';
      let arr = [...savedIngredients];
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      setSavedIngredients(arr);
    } catch (e) {}
  };

  const actuallyCreate = async (fields) => {
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

  const handleSaveForLater = async (fields) => {
    // Save the ingredient fields locally for later creation
    try {
      const key = 'ingredients_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      arr.push(fields || pendingFields);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      navigation.goBack();
    } catch (e) {}
    setShowConfirm(false);
    setPendingFields(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Saved ingredients icon */}
      <TouchableOpacity
        style={styles.savedIcon}
        onPress={openSavedList}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="list" size={32} color="#333" />
      </TouchableOpacity>

      <IngredientForm
        title="Agregar Ingrediente"
        onSubmit={handleCreate}
        loading={loading}
        submitLabel="Agregar ingrediente"
        units={units}
        ingredientOptions={ingredientOptions}
        initialValues={initialValues}
        onSaveForLater={handleSaveForLater}
      />

      <ConfirmationModal
        visible={showConfirm}
        title="Red de datos detectada"
        message="No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar el ingrediente para agregarlo más tarde?"
        confirmText="Continuar"
        cancelText="Posponer"
        onConfirm={handleConfirmProceed}
        onCancel={() => handleSaveForLater()}
      />

      {/* Saved ingredients list modal */}
      {showSavedList && (
        <View style={styles.savedListOverlay}>
          <View style={styles.savedListModal}>
            <Text style={styles.savedListTitle}>Ingredientes guardados</Text>
            {savedIngredients.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay ingredientes guardados.</Text>
            ) : (
              <FlatList
                data={savedIngredients}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.savedItemRow}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                      <Text numberOfLines={1} style={styles.savedItemText}>{item.observations || 'Ingrediente'}</Text>
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
