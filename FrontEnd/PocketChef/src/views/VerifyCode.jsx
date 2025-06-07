import React, { useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import { register } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyCode({ navigation }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [next, setNext] = useState('');

  React.useEffect(() => {
    (async () => {
      const registerDataRaw = await AsyncStorage.getItem('registerData');
      let email = '';
      let isEmpty = false;
      try {
        const registerData = JSON.parse(registerDataRaw);
        if (!registerData || !registerData.email) isEmpty = true;
        email = registerData?.email || '';
      } catch {
        isEmpty = true;
      }
      setRegisterEmail(email);
      if (isEmpty) {
        setAlert({
          visible: true,
          title: 'Sin registro pendiente',
          message: 'No hay ningun registro pendiente guardado en este dispositivo, primero debes registrar un usuario.'
        });
      }
    })();
  }, []);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setAlert({ visible: true, title: 'Código inválido', message: 'El código debe tener 6 dígitos.' });
      return;
    }
    setLoading(true);
    try {
      const registerData = JSON.parse(await AsyncStorage.getItem('registerData'));
      const response = await register({ ...registerData, verificationCode });
      await AsyncStorage.removeItem('registerData');
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
    if (!registerEmail) {
      navigation.replace('Register');
    } else if (next){
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
        {registerEmail ? (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ textAlign: 'center', color: '#444', fontSize: 20, width: '80%' }}>
              Hemos enviado un código de verificación a {registerEmail}. Por favor ingresá el código para continuar.
            </Text>
          </View>
        ) : null}
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
            <AlertModal {...alert} onClose={handleAlertClose} />
          </View>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24, marginVertical: 12 }}>
          <PrimaryButton title={loading ? 'Verificando...' : 'Verificar'} onPress={handleVerify} disabled={loading} />
          <SecondaryButton
            title="Registrarme con otro Email"
            onPress={() => navigation.replace('Register')}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
