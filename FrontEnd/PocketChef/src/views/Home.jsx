import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import TabBar from '../components/TabBar';

export default function Home() {

  const [active, setActive] = useState(0);
  
  /*useEffect(() => {
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
  }, []);*/

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home</Text>
      </View>
      <TabBar activeTab={active} onTabPress={setActive} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
