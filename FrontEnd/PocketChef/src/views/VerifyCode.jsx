import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyCode({ navigation }) {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      // Se espera que el email venga por params
      const email = navigation.getState().routes.find(r => r.name === 'VerifyCode')?.params?.email;
      const response = await fetch('http://localhost:4002/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      if (!response.ok) throw new Error('Código incorrecto');
      navigation.replace('Login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Verificar Código</Text>
      <TextInput placeholder="Código de verificación" value={code} onChangeText={setCode} style={styles.input} />
      <Button title="Verificar" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { width: 200, borderWidth: 1, margin: 8, padding: 8, borderRadius: 5 },
});
