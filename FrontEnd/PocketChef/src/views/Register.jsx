import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import { requestInitialRegister } from '../services/auth';
import { isRecipeNameAvailable } from '../services/validation';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import ClickableText from '../components/global/inputs/ClickableText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [next, setNext] = useState('');

  const handleRegister = async () => {
    // Validación básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !nickname) {
      setAlert({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (!emailRegex.test(email)) {
      setAlert({ visible: true, title: 'Correo inválido', message: 'Ingresa un correo electrónico válido.' });
      return;
    }
    try {
      const response = await requestInitialRegister({ email, nickname });
      let successMsg = 'Se ha enviado un código de verificación a tu correo electrónico.';
      if (response) {
        successMsg = JSON.stringify(response.data).replace(/"/g, '');
      }
      setNext('VerifyCode');
      setAlert({ visible: true, title: 'Registro exitoso', message: successMsg });
      return;
    } catch (err) {
      let errorMsg = 'Error en el registro';
      if (typeof err.response?.data === 'string') {
        const match = err.response.data.match(/"([^"]+)"$/);
        errorMsg = match ? match[1] : err.response.data;
      }
      setAlert({ visible: true, title: 'Error', message: errorMsg });
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, visible: false });
    if (next === 'VerifyCode') {
      navigation.navigate('VerifyCode', { email, nickname });
    }
  };

  // Validation for required fields
  const isFormValid = !!email && !!nickname;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>Registrarse</PageTitle>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <LabeledInput label="Alias" value={nickname} onChangeText={setNickname} />
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginBottom:24}}>
          <PrimaryButton title="Registrarse" onPress={handleRegister} disabled={!isFormValid} />
          <ClickableText onPress={() => navigation.replace('Login')} style={{ marginTop: 20 }}>¿Ya tienes cuenta? Inicia sesión</ClickableText>
          <ClickableText onPress={() => navigation.replace('VerifyCode')} style={{ marginTop: 20 }}>¿Ya tienes un codigo? Verifica tu cuenta</ClickableText>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
