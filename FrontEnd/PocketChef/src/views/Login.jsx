import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticate } from '../services/auth';
import { whoAmI } from '../services/users';
import LabeledInput from '../components/LabeledInput';
import PrimaryButton from '../components/PrimaryButton';
import Popup from '../components/Popup';
import ClickableText from '../components/ClickableText';
import PageTitle from '../components/PageTitle';
import { LinearGradient } from 'expo-linear-gradient';
import chefcito from '../../assets/chefcito.png';
import colors from '../theme/colors';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ visible: false });

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
      const errorMsg = err.response?.data?.message || err.message || 'Ocurrió un error inesperado.';
      setPopup({ visible: true, title: 'Error', message: errorMsg, actions: [{ text: 'OK', onPress: () => setPopup({ visible: false }) }] });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 4 }}>
        <LinearGradient
          colors={['#fff', colors.primary]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <Image source={chefcito} style={{ width: 260, height: 260, resizeMode: 'contain' }} />
        </LinearGradient>
      </View>
      <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{ width: '100%', maxWidth: 400 }}>
          <PageTitle>Iniciar Sesión</PageTitle>
          <LabeledInput placeholder="Email" label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <LabeledInput placeholder="Contraseña" label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
          <PrimaryButton title="Iniciar sesión" onPress={handleLogin} style={{ marginTop: 24 }} />
          <ClickableText onPress={() => navigation.navigate('ForgotPassword')}>¿Olvidaste tu contraseña?</ClickableText>
          <ClickableText onPress={() => navigation.navigate('Register')}>¿No tienes cuenta? Registrate</ClickableText>
          <Popup {...popup} onRequestClose={() => setPopup({ visible: false })} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
