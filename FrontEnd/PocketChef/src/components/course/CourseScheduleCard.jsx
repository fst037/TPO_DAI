import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';

export default function CourseScheduleCard({ schedule, onSelect, navigation, hideEnrollButton = false, style }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getOccupancyColor = () => {
    const totalSlots = schedule.enrolledStudents + schedule.availableSlots;
    const occupancyRate = schedule.enrolledStudents / totalSlots;
    if (occupancyRate >= 0.8) return '#ff6b6b'; // Red - almost full
    if (occupancyRate >= 0.6) return '#ffa726'; // Orange - moderately full
    return '#66bb6a'; // Green - plenty of space
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

  const handleEnrollPress = () => {
    if (navigation) {
      navigation.navigate('ConfirmEnrollment', { 
        courseScheduleId: schedule.id,
        schedule: schedule 
      });
    }
  };

  return (
    <View style={[styles.card, style]}>
      {/* Header: Branch and Price */}
      <View style={styles.headerRow}>
        <View style={styles.branchSection}>
          <View style={styles.branchHeader}>
            <MaterialIcons name="location-on" size={20} color={colors.primary} />
            <Text style={styles.branchName}>{schedule.branch.name}</Text>
          </View>
          <Text style={styles.branchAddress}>{schedule.branch.address}</Text>
        </View>
        
        <View style={styles.priceSection}>
          <Text style={styles.finalPrice}>${calculateFinalPrice().toLocaleString()}</Text>
          {schedule.branch.courseDiscount > 0 && (
            <Text style={styles.originalPrice}>${schedule.course.price.toLocaleString()}</Text>
          )}
        </View>
      </View>

      {/* Main Content Row */}
      <View style={styles.contentRow}>
        {/* Left Column - Dates and Professor */}
        <View style={styles.leftColumn}>
          {/* Date Range */}
          <View style={styles.infoRow}>
            <MaterialIcons name="date-range" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </Text>
          </View>
          
          {schedule.courseDates && (
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={16} color={colors.primary} />
              <Text style={styles.infoText}>
                {schedule.courseDates.length} clases
              </Text>
            </View>
          )}

          {/* Professor Info */}
          {schedule.professorName && (
            <View style={styles.professorRow}>
              <Image
                style={styles.professorPhoto}
                source={{
                  uri: schedule.professorPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                }}
              />
              <View style={styles.professorInfo}>
                <Text style={styles.professorLabel}>Profesor</Text>
                <Text style={styles.professorName}>{schedule.professorName}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Right Column - Availability */}
        <View style={styles.rightColumn}>
          <View style={styles.availabilityHeader}>
            <MaterialIcons name="people" size={18} color={getOccupancyColor()} />
            <Text style={styles.availabilityText}>
              {schedule.enrolledStudents}/{schedule.enrolledStudents + schedule.availableSlots}
            </Text>
          </View>
          <Text style={styles.availabilityLabel}>estudiantes</Text>
          <View style={[styles.occupancyBar, { backgroundColor: colors.lightBorder }]}>
            <View 
              style={[
                styles.occupancyFill, 
                { 
                  width: `${(schedule.enrolledStudents / (schedule.enrolledStudents + schedule.availableSlots)) * 100}%`,
                  backgroundColor: getOccupancyColor()
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Bottom - Discounts/Promotions */}
      {(schedule.branch.courseDiscount > 0) && (
        <View style={styles.promotionSection}>
          <MaterialIcons name="local-offer" size={16} color={colors.success} />
          <Text style={styles.promotionText}>
            {schedule.branch.discountType === 'Porcentaje' 
              ? `${schedule.branch.courseDiscount}% descuento` 
              : `$${schedule.branch.courseDiscount} descuento`}
          </Text>
        </View>
      )}

      {/* Enrollment Button */}
      {!hideEnrollButton && (
        <TouchableOpacity 
          style={styles.enrollButton}
          onPress={handleEnrollPress}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={20} color={colors.background} />
          <Text style={styles.enrollButtonText}>Inscribirse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  branchSection: {
    flex: 1,
    marginRight: 12,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginLeft: 8,
    flex: 1,
  },
  branchAddress: {
    fontSize: 13,
    color: colors.mutedText,
    marginLeft: 28,
  },
  priceSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.mutedText,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftColumn: {
    flex: 2,
    marginRight: 16,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginLeft: 6,
    flex: 1,
  },
  professorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.lightBackground || '#f8f9fa',
    borderRadius: 8,
  },
  professorPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  professorInfo: {
    flex: 1,
  },
  professorLabel: {
    fontSize: 10,
    color: colors.mutedText,
    fontWeight: '500',
  },
  professorName: {
    fontSize: 13,
    color: colors.clickableText,
    fontWeight: '600',
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 16,
    color: colors.clickableText,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  availabilityLabel: {
    fontSize: 11,
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 8,
  },
  occupancyBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  occupancyFill: {
    height: '100%',
    borderRadius: 4,
  },
  promotionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBackground || '#e8f5e8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  promotionText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 6,
    fontWeight: '500',
  },
  enrollButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  enrollButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
