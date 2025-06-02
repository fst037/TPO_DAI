import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      try {
        const response = await fetch('http://localhost:4002/users/whoAmI', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No autenticado');
        const data = await response.json();
        setUser(data);
      } catch (err) {
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
      {user ? (
        <View>
          <Text>Email: {user.email}</Text>
          <Text>Alias: {user.alias}</Text>
          {/* Otros datos del usuario */}
        </View>
      ) : (
        <Text>Cargando...</Text>
      )}
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
