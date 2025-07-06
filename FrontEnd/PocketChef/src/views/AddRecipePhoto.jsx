import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import { uploadImage } from '../services/supabase';
import { addPhotoToRecipe } from '../services/recipes';

export default function AddRecipePhoto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [showSavedList, setShowSavedList] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState([]);
  const queryClient = useQueryClient();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Saved photos logic
  const openSavedList = async () => {
    try {
      const key = 'recipe_photos_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      setSavedPhotos(arr);
      setShowSavedList(true);
    } catch (e) {
      setSavedPhotos([]);
      setShowSavedList(true);
    }
  };

  const handleSelectSaved = (item) => {
    setShowSavedList(false);
    if (item) {
      setImage(item.photoUrl);
    }
  };

  const handleDeleteSaved = async (index) => {
    try {
      const key = 'recipe_photos_saved_for_later';
      let arr = [...savedPhotos];
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
      setSavedPhotos(arr);
    } catch (e) {}
  };

  // Upload logic with network check
  const actuallyUpload = async (img) => {
    setUploading(true);
    try {
      const url = await uploadImage(img);
      if (!url) throw new Error('No se pudo subir la imagen.');
      await addPhotoToRecipe(id, { photoUrl: url });
      queryClient.invalidateQueries(['recipe', id]);
      setAlert({ visible: true, title: 'Foto subida', message: 'La foto se ha subido correctamente.' });
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo subir la foto.' });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setAlert({ visible: true, title: 'Error', message: 'Selecciona una imagen primero.' });
      return;
    }
    const state = await NetInfo.fetch();
    if (state.type === 'wifi') {
      actuallyUpload(image);
    } else {
      setPendingImage(image);
      setShowConfirm(true);
    }
  };

  const handleConfirmProceed = () => {
    setShowConfirm(false);
    if (pendingImage) {
      actuallyUpload(pendingImage);
      setPendingImage(null);
    }
  };

  const handleSaveForLater = async () => {
    try {
      const key = 'recipe_photos_saved_for_later';
      const existing = await AsyncStorage.getItem(key);
      let arr = [];
      if (existing) {
        arr = JSON.parse(existing);
        if (!Array.isArray(arr)) arr = [];
      }
      if (pendingImage) {
        arr.push({ id, photoUrl: pendingImage });
        await AsyncStorage.setItem(key, JSON.stringify(arr));
      }
      navigation.goBack();
    } catch (e) {}
    setShowConfirm(false);
    setPendingImage(null);
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, visible: false });
    if (alert.title === 'Foto subida') {
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Saved photos icon */}
      <TouchableOpacity
        style={styles.savedIcon}
        onPress={openSavedList}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons name="list" size={32} color="#333" />
      </TouchableOpacity>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ minHeight: Dimensions.get('window').height }}>
          <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>Agregar foto</PageTitle>
          <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={[styles.imagePreviewContainer, !image && styles.dashed]}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                {image ? (
                  <View>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.changePhotoIcon}
                      onPress={pickImage}
                      activeOpacity={0.7}
                      >
                      <View style={styles.changePhotoCircle}>
                        <MaterialIcons name="edit" size={22} color={colors.primary} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.placeholderContent}>
                    <MaterialIcons name="add" size={56} color={colors.mutedText} />
                    <Text style={styles.placeholder}>Agregar foto</Text>
                  </View>
                )}
              </TouchableOpacity>              
            </View>
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {/* Button fixed at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title={uploading ? 'Obteniendo Imagen...' : 'Confirmar'}
          onPress={handleUpload}
          disabled={!image || uploading}
        />
      </View>
      <ConfirmationModal
        visible={showConfirm}
        title="Red de datos detectada"
        message="No estás conectado a WiFi. ¿Deseas continuar usando tus datos móviles o prefieres guardar la foto para subirla más tarde?"
        confirmText="Continuar"
        cancelText="Posponer"
        onConfirm={handleConfirmProceed}
        onCancel={handleSaveForLater}
      />

      {/* Saved photos list modal */}
      {showSavedList && (
        <View style={styles.savedListOverlay}>
          <View style={styles.savedListModal}>
            <Text style={styles.savedListTitle}>Fotos guardadas</Text>
            {savedPhotos.length === 0 ? (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No hay fotos guardadas.</Text>
            ) : (
              <FlatList
                data={savedPhotos}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.savedItemRow}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => handleSelectSaved(item)}>
                      <Image source={{ uri: item.photoUrl }} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} />
                      <Text numberOfLines={1} style={styles.savedItemText}>{item.photoUrl.slice(-16)}</Text>
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
  imagePreviewContainer: {
    width: 340,
    height: 260,
    borderRadius: 24,
    backgroundColor: colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  dashed: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.mutedText,
    backgroundColor: 'transparent',
  },
  imagePreview: {
    width: 340,
    height: 260,
    resizeMode: 'cover',
    borderRadius: 24,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: colors.mutedText,
    fontSize: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  changePhotoIcon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 10,
  },
  changePhotoCircle: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 6,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: colors.background,
    borderTopWidth: 0,
    zIndex: 100,
  },
  savedIcon: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    zIndex: 200,
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
