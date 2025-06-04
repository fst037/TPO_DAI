import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import LabeledInput from '../components/LabeledInput';
import PrimaryButton from '../components/PrimaryButton';
import { requestInitialRegister } from '../services/auth';
import { isRecipeNameAvailable } from '../services/validation';
import Popup from '../components/Popup';
import PageTitle from '../components/PageTitle';
import ClickableText from '../components/ClickableText';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popup, setPopup] = useState({ visible: false });

  const handleRegister = async () => {
    // Validación básica
    if (!email || !password || !confirmPassword || !alias || !name || !address) {
      setPopup({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (password !== confirmPassword) {
      setPopup({ visible: true, title: 'Contraseña', message: 'Las contraseñas no coinciden.' });
      return;
    }
    // Validar alias
    try {
      const aliasRes = await isRecipeNameAvailable(alias);
      const aliasData = aliasRes.data;
      if (!aliasData.available) {
        setPopup({
          visible: true,
          title: 'Alias en uso',
          message: `El alias ya existe. Sugerencias: ${aliasData.suggestions?.join(', ') || 'ninguna'}`,
          actions: [
            { text: 'OK', onPress: () => setPopup({ visible: false }) }
          ]
        });
        return;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error validando alias.';
      setPopup({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setPopup({ visible: false }) }] });
      return;
    }
    try {
      await requestInitialRegister({ email, password, alias });
      navigation.replace('VerifyCode', { email });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error en el registro';
      if (err.response?.data?.error === 'EMAIL_EXISTS') {
        setPopup({
          visible: true,
          title: 'Email en uso',
          message: 'El email ya está registrado. ¿Deseas iniciar sesión o usar otro email?',
          actions: [
            { text: 'Iniciar sesión', onPress: () => { setPopup({ visible: false }); navigation.replace('Login', { email }); } },
            { text: 'Usar otro email', onPress: () => setPopup({ visible: false }) }
          ]
        });
        return;
      }
      setPopup({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setPopup({ visible: false }) }] });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps="handled">
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <PageTitle>Registrarse</PageTitle>
            <LabeledInput label="Nombre y Apellido" value={name} onChangeText={setName} />
            <LabeledInput label="Alias" value={alias} onChangeText={setAlias} />
            <LabeledInput label="Domicilio" value={address} onChangeText={setAddress} />
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <LabeledInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            <LabeledInput label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
            <PrimaryButton title="Registrarse" onPress={handleRegister} />
            <ClickableText onPress={() => navigation.navigate('Login')}>¿Ya tienes cuenta? Inicia sesión</ClickableText>
            <Popup {...popup} onRequestClose={() => setPopup({ visible: false })} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
