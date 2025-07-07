import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PrimaryButton from '../components/global/inputs/PrimaryButton';

const StudentRegister = () => {
    const route = useRoute();
    const dniPhotos = route.params?.dniPhotos;
    const tramiteNumber = route.params?.tramiteNumber;
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate('UpgradePrompt', {
      dniPhotos,
      tramiteNumber,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Mejorar a alumno</Text>
        
        {/* Ilustración */}
        <View style={styles.illustrationContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.cardBack}>
              <View style={styles.cardBackLines}>
                <View style={styles.lineShort} />
                <View style={styles.lineLong} />
              </View>
            </View>
            
            {/* Tarjeta de frente (DNI frontal) */}
            <View style={styles.cardFront}>
              <View style={styles.cardContent}>
                <View style={styles.photoPlaceholder}>
                  <View style={styles.personIcon}>
                    <View style={styles.personHead} />
                    <View style={styles.personBody} />
                  </View>
                </View>
                <View style={styles.textLines}>
                  <View style={styles.textLine} />
                  <View style={styles.textLine} />
                  <View style={styles.textLineShort} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Texto principal */}
        <Text style={styles.mainText}>
          Agregá una tarjeta para continuar. No se realizará ningún cobro
        </Text>

        

        {/* Botón */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cardContainer: {
    position: 'relative',
    width: 200,
    height: 140,
  },
  cardBack: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 160,
    height: 100,
    backgroundColor: '#FF8C42',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardBackLines: {
    gap: 8,
  },
  lineShort: {
    width: 60,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  lineLong: {
    width: 100,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF8C42',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  photoPlaceholder: {
    width: 35,
    height: 45,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personIcon: {
    alignItems: 'center',
  },
  personHead: {
    width: 12,
    height: 12,
    backgroundColor: '#adb5bd',
    borderRadius: 6,
    marginBottom: 2,
  },
  personBody: {
    width: 16,
    height: 12,
    backgroundColor: '#adb5bd',
    borderRadius: 8,
  },
  textLines: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  textLine: {
    height: 3,
    backgroundColor: '#FF8C42',
    borderRadius: 2,
  },
  textLineShort: {
    height: 3,
    backgroundColor: '#FF8C42',
    borderRadius: 2,
    width: '70%',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  instructionsContainer: {
    marginBottom: 40,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    backgroundColor: '#adb5bd',
    borderRadius: 3,
    marginTop: 6,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});

export default StudentRegister;