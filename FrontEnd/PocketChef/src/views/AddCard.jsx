import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import LabeledInput from '../components/global/inputs/LabeledInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import colors from '../theme/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { upgradeToStudent, updateCard, whoAmI } from '../services/users';

export default function AddCard({ navigation }) {
  const route = useRoute();
  const dniPhotos = route.params?.dniPhotos;
  const tramiteNumber = route.params?.tramiteNumber;
  const [form, setForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationMonth: '',
    expirationYear: '',
    expirationDisplay: '', // Campo separado para mostrar MM/YY
    securityCode: '',
    dni: '', // DNI del usuario para MercadoPago
  });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  // Verificar si el usuario ya es un estudiante
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await whoAmI();
      const user = response.data;
      setIsStudent(user.studentProfile !== null);
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setCheckingUser(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Agregar espacios cada 4 dígitos
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiration = (value) => {
    // Remover caracteres no numéricos
    const cleaned = value.replace(/[^0-9]/g, '');
    // Agregar slash después del mes
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    if (formatted.length <= 19) { // 16 dígitos + 3 espacios
      handleChange('cardNumber', formatted);
    }
  };

  const handleExpirationChange = (value) => {
    const formatted = formatExpiration(value);
    if (formatted.length <= 5) { // MM/YY
      const parts = formatted.split('/');
      setForm(prev => ({
        ...prev,
        expirationDisplay: formatted,
        expirationMonth: parts[0] || '',
        expirationYear: parts[1] || '',
      }));
    }
  };

  const handleSubmit = async () => {
    const { cardNumber, cardHolderName, expirationMonth, expirationYear, securityCode, dni } = form;
    
    if (!cardNumber || !cardHolderName || !expirationMonth || !expirationYear || !securityCode || !dni) {
      setAlert({
        visible: true,
        title: 'Campos incompletos',
        message: 'Todos los campos son obligatorios.',
      });
      return;
    }

    // Validaciones básicas
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'El número de tarjeta debe tener 16 dígitos.',
      });
      return;
    }

    if (securityCode.length !== 3) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'El código de seguridad debe tener 3 dígitos.',
      });
      return;
    }

    // Validar DNI (debe ser numérico y tener 8 dígitos)
    if (!/^\d{8}$/.test(dni)) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'El DNI debe tener 8 dígitos numéricos.',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos en el formato que espera StudentRequest
      const studentData = {
        cardNumber: cardNumber.replace(/\s/g, ''), // Remover espacios
        cardName: cardHolderName,
        cardExpiry: `${expirationMonth}/${expirationYear}`, // MM/YY format
        cardCvv: securityCode,
        // Usar DNI real del usuario
        dni: dni,
        dniFront: dniPhotos?.front || "dummy",
        dniBack: dniPhotos?.back || "dummy",
        procedureNumber: tramiteNumber || "dummy",
      };

      console.log('Enviando datos de estudiante:', studentData);
      console.log('¿Es estudiante?:', isStudent);
      
      let response;
      if (isStudent) {
        // Usuario ya es estudiante, actualizar tarjeta
        response = await updateCard(studentData);
      } else {
        // Usuario no es estudiante, hacer upgrade
        response = await upgradeToStudent(studentData);
      }
      
      console.log('Respuesta del servidor:', response.data);
      
      setAlert({
        visible: true,
        title: '¡Éxito!',
        message: isStudent 
          ? 'Tarjeta actualizada correctamente.' 
          : 'Tarjeta validada correctamente. ¡Ahora eres un estudiante!',
      });
      
      if (!isStudent) {
        // Guardar estado de estudiante en AsyncStorage
        await AsyncStorage.setItem('isStudent', 'true');
      }
      
      // Navegar a mis tarjetas después de un breve delay
      setTimeout(() => {
        navigation.replace('StudentCourses', { fromUpgrade: !isStudent });
      }, 3000);
      
    } catch (err) {
      console.error('Error al validar tarjeta:', err);
      let errorMsg = 'No se pudo validar la tarjeta. Intente nuevamente.';
      
      if (err.response?.data) {
        // Si es una string directa del servidor
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setAlert({
        visible: true,
        title: 'Error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga mientras se verifica el estado del usuario
  if (checkingUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Verificando estado del usuario...</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <PageTitle>{isStudent ? 'Modificar Tarjeta' : 'Añadir Tarjeta'}</PageTitle>
      
      <View style={styles.cardLogos}>
        <Text style={styles.cardLogosText}>💳 Visa • Mastercard • American Express</Text>
      </View>
      
      <LabeledInput
        label="Número de tarjeta"
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        value={form.cardNumber}
        onChangeText={handleCardNumberChange}
        maxLength={19}
      />
      
      <LabeledInput
        label="Nombre del titular"
        placeholder="María Rodríguez"
        value={form.cardHolderName}
        onChangeText={val => handleChange('cardHolderName', val)}
        autoCapitalize="words"
      />
      
      <LabeledInput
        label="DNI del titular"
        placeholder="12345678"
        keyboardType="numeric"
        value={form.dni}
        onChangeText={val => handleChange('dni', val)}
        maxLength={8}
      />
      
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <LabeledInput
            label="Fecha de caducidad"
            placeholder="MM/AA"
            keyboardType="numeric"
            value={form.expirationDisplay}
            onChangeText={handleExpirationChange}
            maxLength={5}
          />
        </View>
        
        <View style={styles.halfWidth}>
          <LabeledInput
            label="CVV"
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
            value={form.securityCode}
            onChangeText={val => handleChange('securityCode', val)}
            maxLength={3}
          />
        </View>
      </View>
      
      <PrimaryButton 
        title={loading ? "Procesando..." : (isStudent ? "Actualizar Tarjeta" : "Validar y Guardar")} 
        onPress={handleSubmit} 
        style={{ marginTop: 24 }} 
        disabled={loading}
      />
      
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLogos: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
  },
  cardLogosText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
});
