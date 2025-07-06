import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import LabeledInput from '../global/inputs/LabeledInput';
import PrimaryButton from '../global/inputs/PrimaryButton';
import AlertModal from '../global/modals/AlertModal';
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

  useEffect(() => {
    console.log('Initial values:', initialValues);
    
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
    console.log('Submitting recipe with fields:', fields);
    
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
        onPress={handleSubmit}
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
