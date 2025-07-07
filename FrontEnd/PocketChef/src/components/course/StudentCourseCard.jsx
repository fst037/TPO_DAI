import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';

export default function StudentCourseCard({ courseSchedule, style }) {
  // Add safety checks
  if (!courseSchedule || !courseSchedule.course) {
    return null;
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getNextClass = () => {
    if (!courseSchedule?.courseDates || courseSchedule.courseDates.length === 0) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the next upcoming class
    const upcomingClasses = courseSchedule.courseDates
      .filter(date => date?.date && new Date(date.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return upcomingClasses.length > 0 ? upcomingClasses[0] : null;
  };

  const getCompletedClassesCount = () => {
    if (!courseSchedule?.courseDates || courseSchedule.courseDates.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return courseSchedule.courseDates.filter(date => date?.date && new Date(date.date) < today).length;
  };

  const getTotalClassesCount = () => {
    return courseSchedule?.courseDates ? courseSchedule.courseDates.length : 0;
  };

  const getProgressPercentage = () => {
    const total = getTotalClassesCount();
    const completed = getCompletedClassesCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const nextClass = getNextClass();
  const progressPercentage = getProgressPercentage();
  const completedClasses = getCompletedClassesCount();
  const totalClasses = getTotalClassesCount();

  return (
    <View style={[styles.card, style]}>
      {/* Header: Course Name and Branch */}
      <View style={styles.headerRow}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName} numberOfLines={2}>
            {courseSchedule.course?.description || 'Curso sin nombre'}
          </Text>
          <Text style={styles.branchName}>
            {courseSchedule.branch?.name || 'Sucursal no especificada'}
          </Text>
        </View>
        {courseSchedule.course?.coursePhoto && (
          <Image 
            source={{ uri: courseSchedule.course.coursePhoto }} 
            style={styles.courseImage}
          />
        )}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso del curso</Text>
          <Text style={styles.progressText}>
            {completedClasses}/{totalClasses} clases ({progressPercentage}%)
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Course Details */}
      <View style={styles.detailsSection}>
        {courseSchedule.professor && (
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={16} color="#888" />
            <Text style={styles.detailText}>
              Prof. {courseSchedule.professor.name || ''} {courseSchedule.professor.lastName || ''}
            </Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <MaterialIcons name="computer" size={16} color="#888" />
          <Text style={styles.detailText}>
            {courseSchedule.course?.modality || 'Modalidad no especificada'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="schedule" size={16} color="#888" />
          <Text style={styles.detailText}>
            {courseSchedule.course?.duration || 0} horas
          </Text>
        </View>

        {courseSchedule.course?.requirements && (
          <View style={styles.detailRow}>
            <MaterialIcons name="assignment" size={16} color="#888" />
            <Text style={styles.detailText} numberOfLines={2}>
              {courseSchedule.course.requirements}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#E0E0E0',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 4,
    lineHeight: 24,
  },
  branchName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightBackground || '#F5F5F5',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.clickableText,
  },
  progressText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.lightBackground || '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  nextClassSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.primaryBackground || colors.lightBackground || '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.clickableText,
    marginLeft: 6,
  },
  nextClassDate: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.clickableText,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  nextClassTime: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  detailsSection: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.clickableText,
    flex: 1,
    lineHeight: 18,
  },
});
