import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/global/inputs/PrimaryButton';


const TramiteNumber = () => {
    const navigation = useNavigation();
  const route = useRoute();
  const dniPhotos = route.params?.dniPhotos;
  const [tramiteNumber, setTramiteNumber] = useState('');

  const handleVerificar = () => {
    if (tramiteNumber.trim()) {
      console.log('Número de trámite:', tramiteNumber);
      console.log('Fotos DNI:', dniPhotos);
      
      navigation.navigate('StudentRegisterWarning', {
        params: {
          dniPhotos,
          tramiteNumber,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verificá tu identidad</Text>
        
        <Text style={styles.description}>
          Por favor, completá el número de trámite que aparece en tu DNI.
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Número de trámite"
            value={tramiteNumber}
            onChangeText={setTramiteNumber}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>?</Text>
          </TouchableOpacity>
        </View>
        
        <PrimaryButton
          title="Verificar"
          onPress={handleVerificar}
        />
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  infoButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  infoButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  debugSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#4a7c4a',
    textAlign: 'center',
  },
});

export default TramiteNumber;