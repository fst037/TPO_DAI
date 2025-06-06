import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Button } from 'react-native';

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
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido a Home</Text>
      <Button
        title="Ir a Receta"
        onPress={() => navigation.navigate('Receta')}
      />
    </View>
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
