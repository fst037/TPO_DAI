import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import { uploadImage } from '../services/supabase';
import { addMultimediaToStep } from '../services/recipes';

export default function AddStepMultimedia() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeId, stepId } = route.params || {};
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      try {
        // Upload image to supabase immediately after selection
        const url = await uploadImage(result.assets[0].uri);
        if (!url) throw new Error('No se pudo subir la imagen.');
        setImage(url); // Save the uploaded image URL
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo subir la imagen.' });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setAlert({ visible: true, title: 'Error', message: 'Selecciona una imagen primero.' });
      return;
    }
    setUploading(true);
    try {
      // Send request to add multimedia to step with the uploaded image URL
      await addMultimediaToStep(recipeId, stepId, { contentUrl: image });
      queryClient.invalidateQueries(['recipe', recipeId]);
      setAlert({ visible: true, title: 'Imagen subida', message: 'La imagen se ha subido correctamente.' });
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo subir la imagen.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, visible: false });
    if (alert.title === 'Imagen subida') {
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ minHeight: Dimensions.get('window').height }}>
          <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>Agregar imagen al paso</PageTitle>
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
                    <Text style={styles.placeholder}>Agregar imagen</Text>
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
          title={uploading ? 'Subiendo...' : 'Confirmar'}
          onPress={handleUpload}
          disabled={!image || uploading}
        />
      </View>
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
});
