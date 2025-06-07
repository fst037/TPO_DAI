import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import { recoverPassword } from '../services/auth';
import PageTitle from '../components/global/PageTitle';
import AlertModal from '../components/global/modals/AlertModal';
import colors from '../theme/colors';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [popup, setPopup] = useState({ visible: false, title: '', message: '' });

  const handleSendCode = async () => {
    if (!email) {
      setPopup({ visible: true, title: 'Campo requerido', message: 'Ingresa tu email.' });
      return;
    }
    try {
      const response = await recoverPassword({ email });
      let msg = 'Revisa tu correo para el código de recuperación.';
      if (typeof response === 'string') {
        msg = response;
      } else if (response?.message) {
        msg = response.message;
      }
      setPopup({
        visible: true,
        title: 'Código enviado',
        message: msg,
        next: 'ResetPassword'
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Ocurrió un error inesperado.';
      setPopup({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setPopup({ visible: false }) }] });
    }
  };

  const handlePopupClose = () => {
    setPopup({ ...popup, visible: false });
    if (popup.next === 'ResetPassword') {
      navigation.replace('ResetPassword', { email });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }} keyboardShouldPersistTaps="handled">
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <PageTitle>Recuperar contraseña</PageTitle>
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <PrimaryButton title="Enviar código" onPress={handleSendCode} />
            <AlertModal {...popup} onClose={handlePopupClose} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
