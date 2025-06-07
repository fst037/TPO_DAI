import React, { useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import { resetPassword } from '../services/auth';
import colors from '../theme/colors';

export default function ResetPassword({ navigation, route }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const email = route?.params?.email || '';

  const handleReset = async () => {
    if (!code || !password || !confirmPassword) {
      setAlert({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ visible: true, title: 'Contraseña', message: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword({ email, password, verificationCode: code });
      let successMsg = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
      if (typeof response === 'string') {
        successMsg = response;
      } else if (response?.message) {
        successMsg = response.message;
      }
      setAlert({ visible: true, title: 'Éxito', message: successMsg, next: 'Login' });
    } catch (err) {
      let errorMsg = err.message || 'Error Inesperado.';
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
    if (alert.next === 'Login') {
      navigation.replace('Login');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center', paddingHorizontal: 16 }}>Restablecer Contraseña</PageTitle>
        <View style={{ alignItems: 'center', marginBottom: 24, paddingHorizontal: 16 }}>
          <Text style={{ textAlign: 'center', color: colors.clickableText, fontSize: 16, marginBottom: 8 }}>
            Revisa la bandeja de entrada de tu email: {email}
          </Text>
          <Text style={{ textAlign: 'center', color: colors.mutedText, fontSize: 14 }}>
            Ingresa el código que recibiste y elige una nueva contraseña segura para tu cuenta.
          </Text>
        </View>
        <View style={{ justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400, gap: 18 }}>
            <LabeledInput
              label="Código de verificación"
              value={code}
              onChangeText={setCode}
              autoCapitalize="none"
              keyboardType="number-pad"
              maxLength={6}
            />
            <LabeledInput
              label="Nueva contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <LabeledInput
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginVertical: 36 }}>
          <PrimaryButton title={loading ? 'Restableciendo...' : 'Confirmar'} onPress={handleReset} disabled={loading} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
