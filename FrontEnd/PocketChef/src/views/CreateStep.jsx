import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import StepForm from '../components/recipe/StepForm';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addStepToRecipe } from '../services/recipes';
import AlertModal from '../components/global/modals/AlertModal';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import colors from '../theme/colors';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateStep() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, afterStep } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedSteps, setSavedSteps] = useState([]);
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Load saved steps when opening the list
  const openSavedList = async () => {
    try {
      const key = 'steps_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedSteps(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedSteps([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (step) => {
    setShowSavedList(false);
    if (step) {
      navigation.replace('CreateStep', { recipeId, afterStep, initialValues: step });
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      const key = 'steps_saved_for_later';
      let arr = [...savedSteps];
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      setSavedSteps(arr);
    } catch (e) {}
  };

  const actuallyCreate = async (fields) => {
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

  const handleSubmit = async (fields) => {
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
    // Save the step fields locally for later creation
    try {
      const key = 'steps_saved_for_later';
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

  // Get initial values from route params if available
  const initialValues = route?.params?.initialValues || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Saved steps icon */}
      <TouchableOpacity
        style={styles.savedIcon}
        onPress={openSavedList}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="list" size={32} color="#333" />
      </TouchableOpacity>

      <StepForm
        title="Agregar paso"
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Agregar"
        initialValues={initialValues}
        onSaveForLater={handleSaveForLater}
      />
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onRequestClose={() => setAlert({ ...alert, visible: false })}
      />

      <ConfirmationModal
        visible={showConfirm}
        title="Red de datos detectada"
        message="No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar el paso para agregarlo más tarde?"
        confirmText="Continuar"
        cancelText="Posponer"
        onConfirm={handleConfirmProceed}
        onCancel={() => handleSaveForLater()}
      />

      {/* Saved steps list modal */}
      {showSavedList && (
        <View style={styles.savedListOverlay}>
          <View style={styles.savedListModal}>
            <Text style={styles.savedListTitle}>Pasos guardados</Text>
            {savedSteps.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay pasos guardados.</Text>
            ) : (
              <FlatList
                data={savedSteps}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.savedItemRow}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                      <Text numberOfLines={1} style={styles.savedItemText}>{item.text || 'Paso'}</Text>
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
