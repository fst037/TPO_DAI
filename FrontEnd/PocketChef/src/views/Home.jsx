import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../theme/colors';

export default function Home({ navigation }) {
  useEffect(() => {
    // Reemplazá esta URL con la de tu backend real
    fetch('http://localhost:4002/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Respuesta de red no OK');
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos recibidos:', data);
      })
      .catch(error => {
        console.error('Error al hacer fetch:', error);
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 18 }}>
        <PrimaryButton
          title="Iniciar sesión"
          onPress={() => navigation.navigate('Login')}
          style={{ width: 140, paddingVertical: 8, paddingHorizontal: 0, borderRadius: 10, marginVertical: 0 }}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.title}>¡Bienvenido, Usuario Invitado!</Text>
      </View>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});
