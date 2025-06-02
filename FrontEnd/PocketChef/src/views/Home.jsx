import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../theme/colors';
import { NoAuth } from '../services/api';

export default function Home({ navigation }) {
  useEffect(() => {
    NoAuth('/users')
      .then(response => {
        console.log('Datos recibidos:', response.data);
      })
      .catch(error => {
        console.error('Error al hacer fetch:', error.response?.data?.message || error.message);
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
