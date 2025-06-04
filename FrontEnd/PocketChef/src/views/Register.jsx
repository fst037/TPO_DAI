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

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

  const handleRegister = async () => {
    // Validación básica
    if (!email || !password || !confirmPassword || !alias || !name || !address) {
      setAlert({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ visible: true, title: 'Contraseña', message: 'Las contraseñas no coinciden.' });
      return;
    }
    // Validar alias
    try {
      const aliasRes = await isRecipeNameAvailable(alias);
      const aliasData = aliasRes.data;
      if (!aliasData.available) {
        setAlert({
          visible: true,
          title: 'Alias en uso',
          message: `El alias ya existe. Sugerencias: ${aliasData.suggestions?.join(', ') || 'ninguna'}`
        });
        return;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error validando alias.';
      setAlert({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setAlert({ visible: false }) }] });
      return;
    }
    try {
      await requestInitialRegister({ email, password, alias });
      navigation.replace('VerifyCode', { email });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error en el registro';
      if (err.response?.data?.error === 'EMAIL_EXISTS') {
        setAlert({
          visible: true,
          title: 'Email en uso',
          message: 'El email ya está registrado. ¿Deseas iniciar sesión o usar otro email?',
          actions: [
            { text: 'Iniciar sesión', onPress: () => { setAlert({ visible: false }); navigation.replace('Login', { email }); } },
            { text: 'Usar otro email', onPress: () => setAlert({ visible: false }) }
          ]
        });
        return;
      }
      setAlert({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setAlert({ visible: false }) }] });
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
            <LabeledInput label="Alias" value={alias} onChangeText={setAlias} />
            <LabeledInput label="Domicilio" value={address} onChangeText={setAddress} />
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <LabeledInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            <LabeledInput label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
            <AlertModal {...alert} onClose={() => setAlert({ visible: false })} />
          </View>
        </View>
        <View style={{width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginBottom:36}}>
          <PrimaryButton title="Registrarse" onPress={handleRegister}/>
          <ClickableText onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>¿Ya tienes cuenta? Inicia sesión</ClickableText>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
