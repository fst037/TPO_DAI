import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function Home() {
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
    <View style={styles.container}>
      <Text>Home</Text>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
