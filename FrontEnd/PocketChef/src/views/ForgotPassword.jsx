import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LabeledInput from '../components/LabeledInput';
import PrimaryButton from '../components/PrimaryButton';
import Popup from '../components/Popup';
import { recoverPassword } from '../services/auth';
import PageTitle from '../components/PageTitle';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [popup, setPopup] = useState({ visible: false });

  const handleSendCode = async () => {
    if (!email) {
      setPopup({ visible: true, title: 'Campo requerido', message: 'Ingresa tu email.' });
      return;
    }
    try {
      const response = await recoverPassword({ email });
      if (!response.ok) throw new Error('No se pudo enviar el código.');
      setPopup({
        visible: true,
        title: 'Código enviado',
        message: 'Revisa tu correo para el código de recuperación.',
        actions: [{ text: 'OK', onPress: () => { setPopup({ visible: false }); navigation.replace('VerifyCode', { email }); } }]
      });
    } catch (err) {
      setPopup({ visible: true, title: 'Error', message: err.message, actions: [{ text: 'OK', onPress: () => setPopup({ visible: false }) }] });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{ width: '100%', maxWidth: 400 }}>
          <PageTitle>Recuperar contraseña</PageTitle>
          <LabeledInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <PrimaryButton title="Enviar código" onPress={handleSendCode} />
          <Popup {...popup} onRequestClose={() => setPopup({ visible: false })} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
