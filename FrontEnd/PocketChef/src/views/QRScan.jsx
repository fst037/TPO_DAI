import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { markCourseAssistance } from '../services/students';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import { useNavigation } from '@react-navigation/native';
import colors from '../theme/colors';
import { FontFamily } from '../GlobalStyles';

export default function QRScan() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      if (parsed.id && parsed.date) {
        console.log('QR escaneado:', parsed);
        
        await markCourseAssistance(parsed.id, parsed.date);
        setAlertModal({
          visible: true,
          title: 'Asistencia marcada',
          message: '¡Tu asistencia fue registrada correctamente!'
        });
      } else {
        throw new Error('QR inválido');
      }
    } catch (err) {
      console.log('Error al escanear QR:', err.response.data);
      
      setAlertModal({
        visible: true,
        title: 'Error',
        message: 'El código QR no es válido.'
      });
    }
  };

  const resetScanner = () => setScanned(false);

  const handleAlertClose = () => {
    setAlertModal({ visible: false, title: '', message: '' });
    navigation.goBack();
  };

  if (permission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos acceso a la cámara para escanear códigos QR
        </Text>
        <PrimaryButton onPress={requestPermission}>
          Conceder permisos
        </PrimaryButton>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <MaterialIcons name="qr-code-scanner" size={80} color="#fff" />
          </View>
        </View>
      </CameraView>

      <AlertModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        onClose={handleAlertClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    fontFamily: FontFamily.robotoBold,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flipButton: {
    backgroundColor: '#666',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
