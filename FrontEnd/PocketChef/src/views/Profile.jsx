import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { whoAmI } from '../services/users';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      try {
        const response = await whoAmI();
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'No autenticado');
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Perfil de Usuario</Text>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {user ? (
        <View>
          <Text>Email: {user.email}</Text>
          <Text>Alias: {user.alias}</Text>
          {/* Otros datos del usuario */}
        </View>
      ) : !error ? (
        <Text>Cargando...</Text>
      ) : null}
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
