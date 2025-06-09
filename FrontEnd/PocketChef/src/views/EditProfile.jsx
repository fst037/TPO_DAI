import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import { whoAmI, updateProfile } from '../services/users';
import colors from '../theme/colors';
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '../services/supabase'
import * as MediaLibrary from 'expo-media-library'

export default function EditProfile({ navigation }) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [direccion, setDireccion] = useState('');
  const [avatar, setAvatar] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await whoAmI();
        setName(res.data?.name || '');
        setNickname(res.data?.nickname || '');
        setDireccion(res.data?.address || '');
        setAvatar(res.data?.avatar || '');
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: 'No se pudo cargar el perfil.' });
      }
    })();
  }, []);

  const handlePickImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      const mediaLibPermission = await MediaLibrary.requestPermissionsAsync()
  
      if (!permissionResult.granted || !mediaLibPermission.granted) {
        setAlert({ visible: true, title: 'Permiso requerido', message: 'Se necesita acceso a la galería.' });
        return
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // User must crop
        aspect: [1, 1],      // Force 1:1 aspect
        quality: 1,
        base64: false,
      })
  
      if (!result.canceled) {
        const img = result.assets[0]
        // Get a real file URI using assetId
        const asset = await MediaLibrary.getAssetInfoAsync(img.assetId || img.uri)
        const fileUri = asset.localUri || asset.uri
        try {
          const url = await uploadImage(fileUri)
          setAvatar(url);
          setAlert({ visible: true, title: 'Éxito', message: 'Imagen subida correctamente.' });
        } catch (error) {
          setAlert({ visible: true, title: 'Error', message: 'No se pudo subir la imagen.' });
          return;
        }
      }
    };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ nombre: name, nickname, direccion, avatar });
      setAlert({ visible: true, title: 'Éxito', message: 'Perfil actualizado correctamente.', next: 'Profile' });
    } catch (err) {
      let errorMsg = err.message || 'Error al actualizar el perfil.';
      if (typeof err.response?.data === 'string') {
        const match = err.response.data.match(/"([^"]+)"$/);
        errorMsg = match ? match[1] : err.response.data;
      }
      setAlert({ visible: true, title: 'Error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, visible: false });
    if (alert.next === 'Profile') {
      navigation.replace('Profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }} keyboardShouldPersistTaps="handled">
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center', paddingHorizontal: 16 }}>
          Editar Perfil
        </PageTitle>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={handlePickImage} style={{ alignItems: 'center'}}>
            <Image
              source={avatar ? { uri: avatar } : require('../../assets/chefcito.png')}
              style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8, backgroundColor: colors.secondaryBackground }}
            />
            <Text style={{ color: colors.primary, textAlign: 'center', marginBottom: 8 }}>
              Cambiar foto de perfil
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <LabeledInput label="Nombre y Apellido" value={name} onChangeText={setName} />
            <LabeledInput label="Alias" value={nickname} onChangeText={setNickname} />
            <LabeledInput label="Domicilio" value={direccion} onChangeText={setDireccion} />
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginVertical: 36 }}>
          <PrimaryButton title={loading ? 'Guardando...' : 'Guardar Cambios'} onPress={handleSave} disabled={loading} />
        </View>
      </View>
    </ScrollView>
  );
}
