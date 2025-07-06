import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import { useNavigation } from '@react-navigation/native';

const ScanDNI = () => {
  const [frenteImageUri, setFrenteImageUri] = useState(null);
  const [dorsoImageUri, setDorsoImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('frente'); // 'frente' | 'dorso' | 'completed'
  const navigation = useNavigation();

  const cameraOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    aspect: [16, 9],
    allowsEditing: true,
  };

  const openCamera = async (side) => {
    setIsLoading(true);
    
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de cámara para tomar fotos');
        setIsLoading(false);
        return;
      }

      // Abrir la cámara
      const result = await ImagePicker.launchCameraAsync(cameraOptions);
      
      setIsLoading(false);
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        if (side === 'frente') {
          setFrenteImageUri(imageUri);
          console.log('Foto del frente del DNI capturada:', imageUri);
        } else {
          setDorsoImageUri(imageUri);
          console.log('Foto del dorso del DNI capturada:', imageUri);
        }
        
        processDNIImage(imageUri, side);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error al abrir la cámara:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const processDNIImage = (uri, side) => {
    console.log(`Procesando imagen del ${side} del DNI:`, uri);
    
    // Si se capturó el frente, pasar al dorso
    if (side === 'frente') {
      setCurrentStep('dorso');
    } else {
      // Si se capturó el dorso, completar el proceso
      setCurrentStep('completed');
    }
  };

  const retakePhoto = (side) => {
    if (side === 'frente') {
      setFrenteImageUri(null);
      setCurrentStep('frente');
    } else {
      setDorsoImageUri(null);
      setCurrentStep('dorso');
    }
    openCamera(side);
  };

  const confirmBothPhotos = () => {
  if (frenteImageUri && dorsoImageUri) {
    console.log('Fotos confirmadas:', { frente: frenteImageUri, dorso: dorsoImageUri });
    
    navigation.navigate('TramiteNumber', {
      dniPhotos: {
        frente: frenteImageUri,
        dorso: dorsoImageUri
      }
    });
  }
};

  const continueToNext = () => {
    if (currentStep === 'frente' && frenteImageUri) {
      setCurrentStep('dorso');
    } else if (currentStep === 'dorso' && dorsoImageUri) {
      setCurrentStep('completed');
    }
  };

  const getCurrentSubtitle = () => {
    switch (currentStep) {
      case 'frente':
        return 'Toma una foto clara del frente de tu DNI';
      case 'dorso':
        return 'Ahora toma una foto clara del dorso de tu DNI';
      case 'completed':
        return 'Revisa ambas fotos antes de continuar';
      default:
        return 'Captura ambas caras de tu DNI';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mejorar a alumno</Text>
          <Text style={styles.subtitle}>{getCurrentSubtitle()}</Text>
        </View>

        {/* Sección del frente */}
        {(currentStep === 'frente' || frenteImageUri) && (
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>
              Frente del DNI
            </Text>
            <View style={styles.cameraContainer}>
              {frenteImageUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: frenteImageUri }} style={styles.previewImage} />
                </View>
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Text style={styles.placeholderSubtext}>
                    Poner foto del dni
                  </Text>
                </View>
              )}
            </View>
            
            {currentStep === 'frente' && (
              <View style={styles.buttonContainer}>
                {frenteImageUri ? (
                  <View style={styles.buttonRow}>
                    <SecondaryButton
                      title="Tomar otra"
                      onPress={() => retakePhoto('frente')}
                      style={styles.secondaryButtonCustom}
                    />
                    <PrimaryButton
                      title="Continuar"
                      onPress={continueToNext}
                      style={styles.primaryButtonCustom}
                    />
                  </View>
                ) : (
                  <PrimaryButton
                    title={isLoading ? 'Abriendo cámara...' : 'Tomar foto del frente'}
                    onPress={() => openCamera('frente')}
                    disabled={isLoading}
                  />
                )}
              </View>
            )}
            
            {currentStep !== 'frente' && frenteImageUri && (
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  title="Tomar foto del frente de nuevo"
                  onPress={() => retakePhoto('frente')}
                />
              </View>
            )}
          </View>
        )}

        {/* Sección del dorso */}
        {(currentStep === 'dorso' || dorsoImageUri) && (
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>
              Dorso del DNI
            </Text>
            <View style={styles.cameraContainer}>
              {dorsoImageUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: dorsoImageUri }} style={styles.previewImage} />
                </View>
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Text style={styles.placeholderSubtext}>
                    Poner foto del dorso del dni
                  </Text>
                </View>
              )}
            </View>
            
            {currentStep === 'dorso' && (
              <View style={styles.buttonContainer}>
                {dorsoImageUri ? (
                  <View style={styles.buttonRow}>
                    <SecondaryButton
                      title="Tomar otra"
                      onPress={() => retakePhoto('dorso')}
                      style={styles.secondaryButtonCustom}
                    />
                    <PrimaryButton
                      title="Continuar"
                      onPress={continueToNext}
                      style={styles.primaryButtonCustom}
                    />
                  </View>
                ) : (
                  <PrimaryButton
                    title={isLoading ? 'Abriendo cámara...' : 'Tomar foto del dorso'}
                    onPress={() => openCamera('dorso')}
                    disabled={isLoading}
                  />
                )}
              </View>
            )}
            
            {/* Botón para retomar foto del dorso cuando ya se completó */}
            {currentStep === 'completed' && dorsoImageUri && (
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  title="Tomar foto del dorso de nuevo"
                  onPress={() => retakePhoto('dorso')}
                />
              </View>
            )}
          </View>
        )}

        {/* Sección de confirmación final */}
        {currentStep === 'completed' && (
          <View style={styles.finalSection}>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Confirmar ambas fotos"
                onPress={confirmBothPhotos}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  photoSection: {
    margin: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  cameraContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  imageText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButtonCustom: {
    flex: 1,
  },
  secondaryButtonCustom: {
    flex: 1,
  },
  finalSection: {
    margin: 20,
  },
});

export default ScanDNI;