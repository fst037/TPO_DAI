import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import LabeledInput from '../global/inputs/LabeledInput';
import PrimaryButton from '../global/inputs/PrimaryButton';
import AlertModal from '../global/modals/AlertModal';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import colors from '../../theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../services/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllRecipeTypes } from '../../services/recipeTypes';
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import PageTitle from '../global/PageTitle';

export default function RecipeForm({
  title = 'Receta',
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = 'Guardar',
  enableSaveForLater = true,
  saveKey = 'recipes_saved_for_later',
  isEdit = false,
}) {
  const [fields, setFields] = useState({
    recipeName: '',
    recipeDescription: '',
    mainPhoto: '',
    servings: '',
    numberOfPeople: '',
    recipeTypeId: '',
    cookingTime: '',
    ...initialValues,
  });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [uploading, setUploading] = useState(false);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [recipeTypesLoading, setRecipeTypesLoading] = useState(true);
  // Save for later logic
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  // Load saved items when opening the list
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
        servings: item.servings != null ? item.servings.toString() : '',
        numberOfPeople: item.numberOfPeople != null ? item.numberOfPeople.toString() : '',
        cookingTime: item.cookingTime != null ? item.cookingTime.toString() : '',
      };
      // For edit, you may want to navigate or set fields directly
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
      setAlert({ visible: true, title: 'Guardado', message: isEdit ? 'Los cambios se guardaron para continuar más tarde.' : 'La receta se guardó para crearla más tarde.' });
    } catch (e) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo guardar localmente.' });
    }
    setShowConfirm(false);
    setPendingFields(null);
  };

  // Network-aware submit
  const handleFormSubmit = async () => {
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

  useEffect(() => {    
    // Only set fields if initialValues is not empty and fields are still default (empty)
    const isInitialValuesEmpty = Object.keys(initialValues).length === 0;
    if (!isInitialValuesEmpty &&
      Object.values(fields).every(v => v === '' || v === undefined)
    ) {
      setFields(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    const fetchRecipeTypes = async () => {
      try {
        const data = await getAllRecipeTypes();
        if (Array.isArray(data.data)) {
          setRecipeTypes(data.data.map(rt => ({ value: rt.id, label: rt.description })));
        }
      } catch (err) {
        console.log(err);
        
        setAlert({ visible: true, title: 'Error', message: 'No se pudieron cargar los tipos de receta.' });
      }
      setRecipeTypesLoading(false);
    };
    fetchRecipeTypes();
  }, []);

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFields(prev => ({ ...prev, mainPhoto: result.assets[0].uri }));
      setUploading(true);
      try {
        const url = await uploadImage(result.assets[0].uri);
        if (!url) throw new Error('No se pudo subir la imagen.');
        setFields(prev => ({ ...prev, mainPhoto: url, mainPhotoPreview: result.assets[0].uri }));
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo subir la imagen.' });
      }
      setUploading(false);
    }
  };

  const renderPhotoPicker = () => (
    <View style={{ width: '100%', paddingHorizontal: 0 }}>
      <Text style={styles.labeledInputLabel}>Foto principal</Text>
      <TouchableOpacity style={[styles.imagePicker, styles.dashed]} onPress={pickImage} activeOpacity={0.8}>
        {fields.mainPhoto ? (
          <>
            <Image source={{ uri: fields.mainPhoto }} style={styles.imagePreview} />
            <View style={styles.editIconOverlay}>
              <View style={styles.editIconCircle}>
                <MaterialIcons name="edit" size={22} color={colors.primary} />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.placeholderContent}>
            <MaterialIcons name="add" size={48} color={colors.mutedText} />
            <Text style={styles.mutedText}>Agregar foto</Text>
          </View>
        )}
        {uploading && <ActivityIndicator style={styles.uploadingIndicator} color={colors.primary} />}
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = () => {
    if (!fields.recipeName || !fields.recipeDescription) {
      setAlert({ visible: true, title: 'Error', message: 'Completa todos los campos obligatorios.' });
      return;
    }
    onSubmit({
      ...fields,
      servings: Number(fields.servings),
      numberOfPeople: Number(fields.numberOfPeople),
      recipeTypeId: Number(fields.recipeTypeId),
      cookingTime: Number(fields.cookingTime),
    });
  };

  // Validation for required fields
  const isFormValid = fields.recipeName && fields.recipeDescription && fields.recipeTypeId && fields.servings && fields.numberOfPeople && fields.cookingTime && !uploading;

  return (
    <View style={{ flex: 1 }}>
      {/* Saved items icon */}
      {enableSaveForLater && (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 32, right: 24, zIndex: 20, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          onPress={openSavedList}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="folder" size={32} color="#333" />
        </TouchableOpacity>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <PageTitle>{title}</PageTitle>
        <LabeledInput
          label="Nombre de la receta"
          value={fields.recipeName}
          onChangeText={v => handleChange('recipeName', v)}
        />
        <LabeledInput
          label="Descripción"
          value={fields.recipeDescription}
          onChangeText={v => handleChange('recipeDescription', v)}
          multiline
        />
        {renderPhotoPicker()}
        <LabeledInputSelect
          label="Tipo de receta"
          value={fields.recipeTypeId}
          options={recipeTypes}
          onSelect={val => setFields(f => ({ ...f, recipeTypeId: val }))}
          placeholder="Seleccionar tipo"
          disabled={loading}
        />
        <LabeledInput
          label="Porciones"
          value={fields.servings}
          onChangeText={v => handleChange('servings', v.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <LabeledInput
          label="Número de personas"
          value={fields.numberOfPeople}
          onChangeText={v => handleChange('numberOfPeople', v.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <LabeledInput
          label="Tiempo de cocción (min)"
          value={fields.cookingTime}
          onChangeText={v => handleChange('cookingTime', v.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
        />
        <PrimaryButton
          title={loading ? 'Guardando...' : submitLabel}
          onPress={handleFormSubmit}
          disabled={!isFormValid || loading}
          style={{ marginTop: 24 }}
        />
        <AlertModal
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          onRequestClose={() => setAlert({ ...alert, visible: false })}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      </ScrollView>
      {/* Confirmation modal for network-aware save */}
      {enableSaveForLater && (
        <>
      <ConfirmationModal
        visible={showConfirm}
        title="Red de datos detectada"
        message={isEdit ?
          'No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar los cambios para editarlos más tarde?'
          :
          'No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar la receta para crearla más tarde?'}
        confirmText="Continuar"
        cancelText="Posponer"
        onConfirm={() => { setShowConfirm(false); handleSubmit(); }}
        onCancel={() => handleSaveForLater(pendingFields)}
      />
          {/* Saved items list modal */}
          {showSavedList && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 320, maxHeight: 400 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{isEdit ? 'Cambios guardados' : 'Recetas guardadas'}</Text>
                {savedItems.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay datos guardados.</Text>
                ) : (
                  <FlatList
                    data={savedItems}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item, index }) => (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                          <Text numberOfLines={1} style={{ fontSize: 16, color: '#333', marginRight: 12 }}>{item.recipeName || 'Sin nombre'}</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 48,
  },
  labeledInputLabel: {
    marginTop: 16,
    marginBottom: 2, 
    fontWeight: 'bold', 
    color: colors.label 
  },
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: colors.mutedText,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: colors.primary,
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  editIconOverlay: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 10,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 6,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  editIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
