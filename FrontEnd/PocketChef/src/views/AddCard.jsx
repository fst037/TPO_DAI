import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import LabeledInput from '../components/global/inputs/LabeledInput';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import PageTitle from '../components/global/PageTitle';
import colors from '../theme/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { upgradeToStudent } from '../services/users';

export default function AddCard({ navigation }) {
  const [form, setForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationMonth: '',
    expirationYear: '',
    expirationDisplay: '', // Campo separado para mostrar MM/YY
    securityCode: '',
  });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);

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
    const { cardNumber, cardHolderName, expirationMonth, expirationYear, securityCode } = form;
    
    if (!cardNumber || !cardHolderName || !expirationMonth || !expirationYear || !securityCode) {
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

    try {
      setLoading(true);
      
      // Preparar datos en el formato que espera StudentRequest
      const studentData = {
        cardNumber: cardNumber.replace(/\s/g, ''), // Remover espacios
        cardName: cardHolderName,
        cardExpiry: `${expirationMonth}/${expirationYear}`, // MM/YY format
        cardCvv: securityCode,
        // Campos dummy para documentos (los saltamos en el flujo)
        dni: "00000000", // Campo requerido por el backend para el tocken de mp
        dniFront: "dummy",
        dniBack: "dummy",
        procedureNumber: "dummy",
      };

      console.log('Enviando datos de estudiante:', studentData);
      
      const response = await upgradeToStudent(studentData);
      
      console.log('Respuesta del servidor:', response.data);
      
      setAlert({
        visible: true,
        title: '¡Éxito!',
        message: 'Tarjeta validada correctamente. ¡Ahora eres un estudiante!',
      });
      
      // Navegar a mis tarjetas después de un breve delay
      setTimeout(() => {
        navigation.replace('MyCards', { fromUpgrade: true });
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

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <PageTitle>Añadir Tarjeta</PageTitle>
      
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
        title={loading ? "Validando..." : "Validar y Guardar"} 
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
