import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { whoAmI } from '../services/users';
import { isTokenExpired } from '../utils/jwt';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import { enrollInCourseWithCreditCard } from '../services/students';

export default function ConfirmEnrollment() {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseScheduleId, schedule } = route.params;
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['whoAmI'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) return null; 
      return whoAmI().then(res => res.data);
    },
    retry: false,
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateFinalPrice = () => {
    const basePrice = schedule.course.price;
    let finalPrice = basePrice;

    if (schedule.branch.courseDiscount > 0) {
      if (schedule.branch.discountType === 'Porcentaje') {
        finalPrice = basePrice - (basePrice * schedule.branch.courseDiscount / 100);
      } else {
        finalPrice = basePrice - schedule.branch.courseDiscount;
      }
    }

    return finalPrice;
  };

  const handleConfirmEnrollment = async () => {
    setLoading(true);
    try {
      await enrollInCourseWithCreditCard(courseScheduleId);
      
      Alert.alert(
        'Inscripción Exitosa',
        'Te has inscrito correctamente al curso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('StudentCourses')
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo completar la inscripción. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <PageTitle style={styles.title}>Confirmar Inscripción</PageTitle>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Information */}
        <View style={styles.courseSection}>
          <Text style={styles.sectionTitle}>Curso</Text>
          <Text style={styles.courseName}>{schedule.course.description}</Text>
          <Text style={styles.courseDetails}>
            {schedule.course.duration} horas • {schedule.course.modality}
          </Text>
        </View>

        {/* Branch Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sede</Text>
          <View style={styles.branchInfo}>
            <MaterialIcons name="location-on" size={20} color={colors.primary} />
            <View style={styles.branchDetails}>
              <Text style={styles.branchName}>{schedule.branch.name}</Text>
              <Text style={styles.branchAddress}>{schedule.branch.address}</Text>
            </View>
          </View>
        </View>

        {/* Schedule Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fechas</Text>
          <View style={styles.scheduleInfo}>
            <View style={styles.infoRow}>
              <MaterialIcons name="date-range" size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
              </Text>
            </View>
            {schedule.courseDates && (
              <View style={styles.infoRow}>
                <MaterialIcons name="event" size={18} color={colors.primary} />
                <Text style={styles.infoText}>
                  {schedule.courseDates.length} clases programadas
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Professor Information */}
        {schedule.professorName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profesor</Text>
            <View style={styles.professorInfo}>
              <Image
                style={styles.professorPhoto}
                source={{
                  uri: schedule.professorPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                }}
              />
              <Text style={styles.professorName}>{schedule.professorName}</Text>
            </View>
          </View>
        )}

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidad</Text>
          <View style={styles.availabilityInfo}>
            <MaterialIcons name="people" size={18} color={colors.primary} />
            <Text style={styles.availabilityText}>
              {schedule.enrolledStudents}/{schedule.enrolledStudents + schedule.availableSlots} estudiantes inscriptos
            </Text>
          </View>
          <Text style={styles.availabilityNote}>
            Quedan {schedule.availableSlots} cupos disponibles
          </Text>
        </View>

        {/* Price Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precio</Text>
          <View style={styles.priceInfo}>
            <Text style={styles.finalPrice}>${calculateFinalPrice().toLocaleString()}</Text>
            {schedule.branch.courseDiscount > 0 && (
              <View style={styles.discountInfo}>
                <Text style={styles.originalPrice}>${schedule.course.price.toLocaleString()}</Text>
                <View style={styles.discountBadge}>
                  <MaterialIcons name="local-offer" size={14} color={colors.success} />
                  <Text style={styles.discountText}>
                    {schedule.branch.discountType === 'Porcentaje' 
                      ? `${schedule.branch.courseDiscount}% OFF` 
                      : `$${schedule.branch.courseDiscount} OFF`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method */}
        {user?.studentProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>
            <View style={styles.paymentInfo}>
              <MaterialIcons name="credit-card" size={20} color={colors.primary} />
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentMethod}>Tarjeta de Crédito</Text>
                <Text style={styles.cardNumber}>{user.studentProfile.cardNumber}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <SecondaryButton
          title="Cancelar"
          onPress={handleCancel}
          style={styles.cancelButton}
        />
        <PrimaryButton
          title={loading ? "Inscribiendo..." : "Confirmar Inscripción"}
          onPress={handleConfirmEnrollment}
          style={styles.confirmButton}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    marginTop: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  courseSection: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 12,
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 8,
  },
  courseDetails: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  branchInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  branchDetails: {
    marginLeft: 12,
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.clickableText,
  },
  branchAddress: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 2,
  },
  scheduleInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: colors.secondaryText,
    marginLeft: 8,
  },
  professorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  professorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.clickableText,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 16,
    color: colors.secondaryText,
    marginLeft: 8,
  },
  availabilityNote: {
    fontSize: 14,
    color: colors.mutedText,
    fontStyle: 'italic',
  },
  priceInfo: {
    alignItems: 'flex-start',
  },
  finalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  discountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.mutedText,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBackground || '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.clickableText,
  },
  cardNumber: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: 2,
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBackground || '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  balanceText: {
    fontSize: 14,
    color: colors.success,
    marginLeft: 8,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },
});
