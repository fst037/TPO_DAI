import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate } from '../services/auth';
import { whoAmI } from '../services/users';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import ClickableText from '../components/global/inputs/ClickableText';
import PageTitle from '../components/global/PageTitle';
import { LinearGradient } from 'expo-linear-gradient';
import chefcito from '../../assets/chefcito.png';
import colors from '../theme/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('santi@gmail.com');
  const [password, setPassword] = useState('santi');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

  const handleLogin = async () => {
    try {
      const response = await authenticate({ email, password });
      const data = response.data;
      await AsyncStorage.setItem('token', data.access_token);
      // Fetch user info after login
      const userResponse = await whoAmI();
      const user = userResponse.data;
      await AsyncStorage.multiSet([
        ['user_id', user.id?.toString() ?? ''],
        ['user_name', user.name ?? ''],
        ['user_nickname', user.nickname ?? ''],
        ['user_email', user.email ?? ''],
      ]);
      navigation.replace('Profile');
    } catch (err) {
      let errorMsg = 'Ocurrió un error inesperado.';
      
      if (err.response?.status === 403) {
        errorMsg = 'Usuario o contraseña incorrectos.';
      }
      setAlert({ visible: true, title: 'Error', message: errorMsg });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }} 
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <View style={{ height: 400 }}>
          <LinearGradient
            colors={[colors.background, colors.primary]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <Image source={chefcito} style={{ width: 300, marginBottom: 32, height: 300, resizeMode: 'contain' }} />
          </LinearGradient>
        </View>
        <View style={{
          flexGrow: 1,
          backgroundColor: colors.background,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          marginTop: -32,
          paddingTop: 32,
          paddingHorizontal: 24,
          width: '100%',
          alignSelf: 'center',
          shadowColor: colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <PageTitle>Iniciar Sesión</PageTitle>
          <LabeledInput placeholder="Email" label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <LabeledInput placeholder="Contraseña" label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
          <PrimaryButton title="Iniciar sesión" onPress={handleLogin} style={{ marginTop: 24 }} />
          <ClickableText onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 24 }}>¿Olvidaste tu contraseña?</ClickableText>
          <ClickableText onPress={() => navigation.replace('Register')} style={{ marginTop: 24 }}>¿No tienes cuenta? Registrate</ClickableText>
          <AlertModal
            visible={alert.visible}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
