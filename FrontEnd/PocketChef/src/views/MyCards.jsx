import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import AlertModal from '../components/global/modals/AlertModal';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import colors from '../theme/colors';
import { whoAmI } from '../services/users';

export default function MyCards({ navigation, route }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showModifyCardModal, setShowModifyCardModal] = useState(false);

  // Detectar si viene del flujo de upgrade
  const isFromUpgrade = route?.params?.fromUpgrade || false;

  useEffect(() => {
    loadUserInfo();
    
    // Mostrar modal de felicitaciones si viene del upgrade
    if (isFromUpgrade) {
      setShowCongratulationsModal(true);
    }
  }, [isFromUpgrade]);

  const loadUserInfo = async () => {
    try {
      const response = await whoAmI();
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos reales de la tarjeta del usuario
  const getCardData = () => {
    if (userInfo?.studentProfile?.cardNumber) {
      // Extraer los últimos 4 dígitos del número de tarjeta
      const cardNumber = userInfo.studentProfile.cardNumber;
      const last4 = cardNumber.substring(cardNumber.length - 4);
      
      // Usar el tipo de tarjeta detectado automáticamente por el backend
      let cardType = userInfo.studentProfile.cardType || 'Tarjeta de crédito/débito';
      
      // Mostrar texto amigable para tarjetas que existían antes de la migración
      if (cardType === 'Tarjeta existente') {
        cardType = 'Tarjeta de crédito/débito';
      }
      
      return {
        last4: last4,
        brand: cardType,
        holderName: userInfo.studentProfile.cardName || 'Titular',
        cardNumber: userInfo.studentProfile.cardNumber
      };
    }
    
    // Si no hay datos de tarjeta, usar datos por defecto
    return {
      last4: '****',
      brand: 'No registrada',
      holderName: userInfo?.studentProfile?.cardName || 'Usuario',
      cardNumber: null
    };
  };

  const cardData = getCardData();

  const handleModifyCard = () => {
    if (userInfo?.studentProfile?.cardNumber) {
      setShowModifyCardModal(true);
    } else {
      // Si no hay tarjeta, ir directamente a agregar
      navigation.navigate('AddCard');
    }
  };

  const handleConfirmModifyCard = () => {
    setShowModifyCardModal(false);
    navigation.navigate('AddCard');
  };

  const handleCancelModifyCard = () => {
    setShowModifyCardModal(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCloseCongratulations = () => {
    setShowCongratulationsModal(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageTitle>Mis tarjetas</PageTitle>

      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {userInfo?.studentProfile?.cardNumber ? 'Método de pago registrado' : 'No hay tarjeta registrada'}
          </Text>
        </View>
        
        {userInfo?.studentProfile?.cardNumber ? (
          <View style={styles.cardItem}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>💳</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardBrand}>{cardData.brand}</Text>
              <Text style={styles.cardNumber}>•••• •••• •••• {cardData.last4}</Text>
              <Text style={styles.cardHolder}>{cardData.holderName}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noCardContainer}>
            <Text style={styles.noCardText}>Aún no tienes una tarjeta registrada</Text>
            <Text style={styles.noCardSubtext}>Agrega una tarjeta para completar tu perfil de estudiante</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.modifyButton}
          onPress={handleModifyCard}
          activeOpacity={0.7}
        >
          <Text style={styles.modifyText}>
            {userInfo?.studentProfile?.cardNumber ? 'Cambiar tarjeta' : 'Agregar tarjeta'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Continuar"
          onPress={handleGoBack}
          style={styles.continueButton}
        />
      </View>

      {/* Modal de Felicitaciones */}
      <AlertModal
        visible={showCongratulationsModal}
        title="¡Felicitaciones!"
        message="Ahora eres un estudiante y puedes inscribirte a cursos. Tu tarjeta ha sido validada y guardada correctamente."
        onClose={handleCloseCongratulations}
        buttonText="¡Genial!"
      />

      {/* Modal de Modificar Tarjeta */}
      <ConfirmationModal
        visible={showModifyCardModal}
        title="Cambiar tarjeta"
        message="Se reemplazará la tarjeta actual con la nueva información que ingreses. ¿Deseas continuar?"
        onConfirm={handleConfirmModifyCard}
        onCancel={handleCancelModifyCard}
        confirmText="Continuar"
        cancelText="Cancelar"
        confirmColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 24,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary + '20',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  cardHolder: {
    fontSize: 14,
    color: colors.text + '80',
  },
  noCardContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noCardText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  noCardSubtext: {
    fontSize: 14,
    color: colors.text + '80',
    textAlign: 'center',
  },
  modifyButton: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modifyText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  continueButton: {
    width: '100%',
  },
});
