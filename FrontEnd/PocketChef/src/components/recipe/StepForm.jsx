import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import LabeledInput from '../global/inputs/LabeledInput';
import PrimaryButton from '../global/inputs/PrimaryButton';
import AlertModal from '../global/modals/AlertModal';
import PageTitle from '../global/PageTitle';
import colors from '../../theme/colors';

export default function StepForm({
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = 'Guardar',
  title,
  enableSaveForLater = true,
  saveKey = 'steps_saved_for_later',
  isEdit = false,
}) {
  const [fields, setFields] = useState({
    text: '',
    ...initialValues,
  });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  // Save for later logic
  const [pendingFields, setPendingFields] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFields(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!fields.text) {
      setAlert({ visible: true, title: 'Error', message: 'El texto del paso es obligatorio.' });
      return;
    }
    onSubmit(fields);
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
      setFields({ ...fields, ...item });
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
    if (!fields.text) {
      setAlert({ visible: true, title: 'Error', message: 'El texto del paso es obligatorio.' });
      return;
    }
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
  const isFormValid = fields.text && !loading;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, minHeight: '100%' }}>
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
        <View style={{ flex: 1 }}>
          <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>{title}</PageTitle>
          <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', paddingHorizontal: 24 }}>
            <LabeledInput
              label="Descripción del paso"
              value={fields.text}
              onChangeText={v => handleChange('text', v)}
              multiline
            />
            <AlertModal
              visible={alert.visible}
              title={alert.title}
              message={alert.message}
              onRequestClose={() => setAlert({ ...alert, visible: false })}
            />
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24 }}>
            <PrimaryButton
              title={loading ? 'Guardando...' : submitLabel}
              onPress={handleFormSubmit}
              disabled={!isFormValid || loading}
            />
          </View>
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
              'No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar el paso para agregarlo más tarde?'}
            confirmText="Continuar"
            cancelText="Posponer"
            onConfirm={() => { setShowConfirm(false); handleSubmit(); }}
            onCancel={() => handleSaveForLater(pendingFields)}
          />
          {/* Saved items list modal */}
          {showSavedList && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: 320, maxHeight: 400 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{isEdit ? 'Cambios guardados' : 'Pasos guardados'}</Text>
                {savedItems.length === 0 ? (
                  <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay datos guardados.</Text>
                ) : (
                  <FlatList
                    data={savedItems}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={({ item, index }) => (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSaved(item)}>
                          <Text numberOfLines={1} style={{ fontSize: 16, color: '#333', marginRight: 12 }}>{item.text || 'Paso'}</Text>
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
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: colors.background,
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
  },
});
