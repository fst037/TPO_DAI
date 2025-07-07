import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getAttendanceToCourseSchedule } from '../services/course-schedules';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import AlertModal from '../components/global/modals/AlertModal';

export default function Attendance({ navigation }) {
  const route = useRoute();
  const { courseScheduleId, courseSchedule } = route.params || {};
  
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!courseScheduleId) {
        setAlert({ visible: true, title: 'Error', message: 'ID de curso no válido.' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAttendanceToCourseSchedule(courseScheduleId);
        setAttendanceData(response.data || null);
        console.log('Attendance data:', response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setAlert({ 
          visible: true, 
          title: 'Error', 
          message: 'No se pudo cargar la información de asistencia.' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [courseScheduleId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateWithWeekday = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getAttendanceStats = () => {
    if (!attendanceData) {
      return { totalClasses: 0, attendedClasses: 0, attendancePercentage: 0 };
    }
    
    return {
      totalClasses: attendanceData.totalScheduledClasses || 0,
      attendedClasses: attendanceData.attendedClasses || 0,
      attendancePercentage: Math.round(attendanceData.attendancePercentage || 0)
    };
  };

  const { totalClasses, attendedClasses, attendancePercentage } = getAttendanceStats();

  const getAttendanceStatus = (record) => {
    const classDate = new Date(record.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    classDate.setHours(0, 0, 0, 0);

    // If class hasn't happened yet
    if (classDate > today) {
      return { icon: 'schedule', color: '#757575', text: 'Pendiente' };
    }
    
    // If class has happened
    if (record.attended) {
      return { icon: 'check-circle', color: '#4CAF50', text: 'Presente' };
    } else {
      return { icon: 'cancel', color: '#f44336', text: 'Ausente' };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Asistencia</PageTitle>
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Asistencia</PageTitle>
        
        {/* Course Information */}
        <View style={styles.courseInfoCard}>
          <Text style={styles.courseName}>
            {attendanceData?.courseName || courseSchedule?.course?.description || 'Curso'}
          </Text>
          <Text style={styles.branchName}>{courseSchedule?.branch?.name || 'Sucursal'}</Text>
          
          {/* Course Schedule Dates */}
          {courseSchedule && (courseSchedule.startDate || courseSchedule.endDate) && (
            <Text style={styles.scheduleTime}>
              {formatDate(courseSchedule.startDate)} - {formatDate(courseSchedule.endDate)}
            </Text>
          )}
          
          {courseSchedule?.professorName && (
            <Text style={styles.professorName}>
              Prof. {courseSchedule.professorName}
            </Text>
          )}
        </View>

        {/* Attendance Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Asistencia</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{attendedClasses}</Text>
              <Text style={styles.summaryLabel}>Presentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{totalClasses - attendedClasses}</Text>
              <Text style={styles.summaryLabel}>Ausentes</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>{attendancePercentage}%</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${attendancePercentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Attendance List */}
        <Text style={styles.sectionTitle}>Detalle de Asistencia</Text>
        
        {!attendanceData || !attendanceData.attendanceRecords || attendanceData.attendanceRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-note" size={48} color={colors.mutedText} />
            <Text style={styles.emptyText}>No hay registros de asistencia disponibles.</Text>
          </View>
        ) : (
          <ScrollView style={styles.attendanceList} showsVerticalScrollIndicator={false}>
            {attendanceData.attendanceRecords.map((record, index) => {
              const status = getAttendanceStatus(record);
              return (
                <View key={index} style={styles.attendanceItem}>
                  <View style={styles.attendanceDate}>
                    <MaterialIcons name="event" size={20} color={colors.primary} />
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateText}>
                        {record.scheduledDate ? formatDateWithWeekday(record.scheduledDate) : 'Fecha no disponible'}
                      </Text>
                      <Text style={styles.classNumber}>Clase {index + 1}</Text>
                    </View>
                  </View>
                  <View style={styles.attendanceStatus}>
                    <MaterialIcons name={status.icon} size={24} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <AlertModal
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  courseInfoCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#E0E0E0',
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 4,
  },
  branchName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
    marginBottom: 4,
  },
  professorName: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  summaryCard: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.clickableText,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.lightBackground || '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 8,
  },
  attendanceList: {
    flex: 1,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#E0E0E0',
  },
  attendanceDate: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateInfo: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.clickableText,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  classNumber: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  attendanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: 'center',
    marginTop: 16,
  },
});
