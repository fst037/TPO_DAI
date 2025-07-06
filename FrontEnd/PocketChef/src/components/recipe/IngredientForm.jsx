import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import LabeledInput from '../global/inputs/LabeledInput';
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import PrimaryButton from '../global/inputs/PrimaryButton';
import PageTitle from '../global/PageTitle';

const IngredientForm = ({
  title = '',
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
  units = [],
  ingredientOptions = [],
  enableSaveForLater = true,
  saveKey = 'ingredients_saved_for_later',
  isEdit = false,
}) => {
  const [fields, setFields] = useState({
    quantity: initialValues.quantity || '',
    unitId: initialValues.unitId || '',
    ingredientId: initialValues.ingredientId || '',
    observations: initialValues.observations || '',
  });
  const [errors, setErrors] = useState({});
  // Save for later logic
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  const handleChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };  

  const handleSubmit = () => {
    // Basic validation    
    let newErrors = {};
    if (!fields.quantity) newErrors.quantity = 'Cantidad requerida';
    if (!fields.unitId) newErrors.unitId = 'Unidad requerida';
    if (!fields.ingredientId) newErrors.ingredientId = 'Ingrediente requerido';
    setErrors(newErrors);        
    if (Object.keys(newErrors).length === 0) {
      onSubmit(fields);
    }
  };

  // Save for later logic
  const openSavedList = async () => {
    try {
      const existing = await AsyncStorage.getItem(saveKey);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedItems(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedItems([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (item) => {
    setShowSavedList(false);
    if (item) {
      // Ensure numbers are strings for form fields
      const initialValues = {
        ...item,
        quantity: item.quantity != null ? item.quantity.toString() : '',
        unitId: item.unitId != null ? item.unitId.toString() : '',
        ingredientId: item.ingredientId != null ? item.ingredientId.toString() : '',
      };
      setFields(initialValues);
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      let arr = [...savedItems];
      arr.splice(index, 1);
      await AsyncStorage.setItem(saveKey, JSON.stringify(arr));
      setSavedItems(arr);
    } catch (e) {}
  };

  const handleSaveForLater = async (fieldsToSave) => {
    try {
      const existing = await AsyncStorage.getItem(saveKey);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      arr.push(fieldsToSave || fields);
      await AsyncStorage.setItem(saveKey, JSON.stringify(arr));
    } catch (e) {}
    setShowConfirm(false);
    setPendingFields(null);
  };

  // Network-aware submit
  const handleFormSubmit = async () => {
    // Basic validation    
    let newErrors = {};
    if (!fields.quantity) newErrors.quantity = 'Cantidad requerida';
    if (!fields.unitId) newErrors.unitId = 'Unidad requerida';
    if (!fields.ingredientId) newErrors.ingredientId = 'Ingrediente requerido';
    setErrors(newErrors);        
    if (Object.keys(newErrors).length !== 0) return;
    // Check network type
    const state = await NetInfo.fetch();
    if (state.type === 'wifi') {
      handleSubmit();
    } else if (enableSaveForLater) {
      setPendingFields(fields);
      setShowConfirm(true);
    } else {
      handleSubmit();
    }
  };

  // Validation for required fields
  const isFormValid = fields.quantity && fields.unitId && fields.ingredientId && !loading;

  return (
    <View style={{ flex: 1 }}>
      {/* Saved items icon */}
      {enableSaveForLater && (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 100, right: 24, zIndex: 20, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          onPress={openSavedList}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="folder" size={32} color="#333" />
        </TouchableOpacity>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <PageTitle>{title}</PageTitle>
          <LabeledInput
            label="Cantidad"
            value={fields.quantity}
            onChangeText={(v) => handleChange('quantity', v)}
            keyboardType="numeric"
            error={errors.quantity}
          />
          <LabeledInputSelect
            label="Unidad"
            value={fields.unitId}
            options={units}
            onSelect={(v) => handleChange('unitId', v)}
            error={errors.unitId}
          />
          <LabeledInputSelect
            label="Ingrediente"
            value={fields.ingredientId}
            options={ingredientOptions}
            onSelect={(v) => handleChange('ingredientId', v)}
            error={errors.ingredientId}
          />
          <LabeledInput
            label="Observaciones"
            value={fields.observations}
            onChangeText={(v) => handleChange('observations', v)}
            multiline
            error={errors.observations}
          />
          <View style={{ flex: 1 }} />
          <PrimaryButton
            title={submitLabel}
            onPress={handleFormSubmit}
            loading={loading}
            disabled={!isFormValid || loading}
            style={{ marginTop: 24 }}
          />
        </View>
      </TouchableWithoutFeedback>
      {/* Confirmation modal for network-aware save */}
      {enableSaveForLater && (
        <>
          <ConfirmationModal
            visible={showConfirm}
            title="Red de datos detectada"
            message={isEdit ?
              'No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar los cambios para editarlos más tarde?'
              :
              'No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar el ingrediente para agregarlo más tarde?'}
            confirmText="Continuar"
            cancelText="Posponer"
            onConfirm={() => { setShowConfirm(false); handleSubmit(); }}
            onCancel={() => handleSaveForLater(pendingFields)}
          />
          {/* Saved items list modal */}
          {showSavedList && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 320, maxHeight: 400 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{isEdit ? 'Cambios guardados' : 'Ingredientes guardados'}</Text>
                {savedItems.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay datos guardados.</Text>
                ) : (
                  <FlatList
                    data={savedItems}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item, index }) => (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                          <Text numberOfLines={1} style={{ fontSize: 16, color: '#333', marginRight: 12 }}>{item.observations || 'Ingrediente'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteSaved(index)}>
                          <MaterialIcons name="delete" size={22} color="#c00" />
                        </TouchableOpacity>
                      </View>
                    )}
                    style={{ maxHeight: 260, marginBottom: 8 }}
                  />
                )}
                <PrimaryButton title="Cerrar" onPress={() => setShowSavedList(false)} />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
});

export default IngredientForm;
