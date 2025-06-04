import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { register } from '../services/auth';

export default function VerifyCode({ navigation }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setError('');
    try {
      const email = navigation.getState().routes.find(r => r.name === 'VerifyCode')?.params?.email;
      await register({ email, code });
      navigation.replace('Login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Código incorrecto');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps="handled">
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <View style={styles.container}>
          <Text>Verificar Código</Text>
          <TextInput placeholder="Código de verificación" value={code} onChangeText={setCode} style={styles.input} />
          <Button title="Verificar" onPress={handleVerify} />
          {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { width: 200, borderWidth: 1, margin: 8, padding: 8, borderRadius: 5 },
});
