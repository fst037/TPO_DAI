import React, { useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import { register } from '../services/auth';
import ClickableText from '../components/ClickableText';

export default function VerifyCode({ navigation, route }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState('');
  // Get email and nickname from params if present, and prefill inputs, but allow editing
  const [email, setEmail] = useState(route?.params?.email || '');
  const [nickname, setNickname] = useState(route?.params?.nickname || '');

  React.useEffect(() => {
    // No need to check for email/nickname anymore
  }, []);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setAlert({ visible: true, title: 'Código inválido', message: 'El código debe tener 6 dígitos.' });
      return;
    }
    if (!name || !address || !password || !confirmPassword) {
      setAlert({ visible: true, title: 'Campos requeridos', message: 'Completa todos los campos.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ visible: true, title: 'Contraseña', message: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    try {
      const response = await register({ name, address, password, verificationCode });
      let successMsg = 'Código verificado exitosamente. Ahora podés iniciar sesión.';
      if (response) {
        successMsg = JSON.stringify(response.data).replace(/"/g, '');
      }
      setNext('Login');
      setAlert({ visible: true, title: 'Éxito', message: successMsg });
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
    if (next){
      navigation.replace('Login');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>Verificar Código</PageTitle>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ textAlign: 'center', color: '#444', fontSize: 20, width: '80%' }}>
            Hemos enviado un código de verificación a tu correo electrónico. Por favor ingresá el código y completa tus datos para finalizar el registro.
          </Text>
        </View>
        <View style={{ justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <LabeledInput
              label="Código de verificación"
              value={verificationCode}
              onChangeText={setVerificationCode}
              autoCapitalize="none"
              keyboardType="number-pad"
              maxLength={6}
            />
            <LabeledInput label="Correo Electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <LabeledInput label="Alias" value={nickname} onChangeText={setNickname} autoCapitalize="none" />
            <LabeledInput label="Nombre y Apellido" value={name} onChangeText={setName} />
            <LabeledInput label="Domicilio" value={address} onChangeText={setAddress} />
            <LabeledInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            <LabeledInput label="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" />
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginVertical: 12 }}>
          <PrimaryButton title={loading ? 'Verificando...' : 'Verificar'} onPress={handleVerify} disabled={loading} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
