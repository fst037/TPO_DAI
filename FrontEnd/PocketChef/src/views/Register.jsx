import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabeledInput from '../components/LabeledInput';
import PrimaryButton from '../components/PrimaryButton';
import { requestInitialRegister } from '../services/auth';
import { isRecipeNameAvailable } from '../services/validation';
import AlertModal from '../components/AlertModal';
import PageTitle from '../components/PageTitle';
import ClickableText from '../components/ClickableText';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('santi@gmail.com');
  const [password, setPassword] = useState('santi');
  const [nickname, setNickname] = useState('santi');
  const [name, setName] = useState('santi');
  const [address, setAddress] = useState('santi');
  const [confirmPassword, setConfirmPassword] = useState('santi');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [next, setNext] = useState('');

  const handleRegister = async () => {
    // Validación básica
    if (!email || !password || !confirmPassword || !nickname || !name || !address) {
      setAlert({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ visible: true, title: 'Contraseña', message: 'Las contraseñas no coinciden.' });
      return;
    }
    try {      
      await AsyncStorage.removeItem('registerData');
      const response = await requestInitialRegister({ email, nickname });
      await AsyncStorage.setItem(
        'registerData',
        JSON.stringify({ email, password, nickname, name, address })
      );
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
        // Extract message after the last quote if present, else use the string as is
        const match = err.response.data.match(/"([^"]+)"$/);
        errorMsg = match ? match[1] : err.response.data;
      }
      setAlert({ visible: true, title: 'Error', message: errorMsg });
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, visible: false });
    if (next === 'VerifyCode') {
      navigation.navigate('VerifyCode');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>Registrarse</PageTitle>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <LabeledInput label="Nombre y Apellido" value={name} onChangeText={setName} />
            <LabeledInput label="Alias" value={nickname} onChangeText={setNickname} />
            <LabeledInput label="Domicilio" value={address} onChangeText={setAddress} />
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <LabeledInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            <LabeledInput label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginBottom:24}}>
          <PrimaryButton title="Registrarse" onPress={handleRegister}/>
          <ClickableText onPress={() => navigation.replace('Login')} style={{ marginTop: 20 }}>¿Ya tienes cuenta? Inicia sesión</ClickableText>
          <ClickableText onPress={() => navigation.replace('VerifyCode')} style={{ marginTop: 20 }}>¿Ya tienes un codigo? Verifica tu cuenta</ClickableText>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
