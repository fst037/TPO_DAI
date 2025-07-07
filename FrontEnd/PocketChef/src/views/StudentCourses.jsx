import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getUserById, whoAmI } from '../services/users';
import { getStudentById, dropOutOfCourseToCreditCard, dropOutOfCourseToAppBalance } from '../services/students';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserIdFromToken } from '../utils/jwt';
import { isTokenExpired } from '../utils/jwt';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import CourseScheduleCard from '../components/course/CourseScheduleCard';
import StudentCourseCard from '../components/course/StudentCourseCard';
import OptionsModal from '../components/global/modals/OptionsModal';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import AlertModal from '../components/global/modals/AlertModal';

export default function StudentCourses({ navigation }) {
  const [studentId, setStudentId] = useState(undefined);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [finishedCourses, setFinishedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Ongoing, 1: Finished
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDropOut, setConfirmDropOut] = useState(false);
  const [selectedCourseSchedule, setSelectedCourseSchedule] = useState(null);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['whoAmI'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) return null; 
      return whoAmI().then(res => res.data);
    },
    retry: false,
  });

  // Obtener cursos del estudiante
  useEffect(() => {
    if (user?.studentProfile) {
      setLoading(true);
      setOngoingCourses(user.studentProfile.currentCourses || []);
      setFinishedCourses(user.studentProfile.finishedCourses || []);
      console.log('Ongoing Courses:', user.studentProfile.currentCourses);
      console.log('Finished Courses:', user.studentProfile.finishedCourses);
      setLoading(false);
    }
  }, [user]);

  const handleViewAttendance = () => {
    setMenuVisible(false);
    // Navigate to attendance view with course schedule data
    navigation.navigate('Attendance', { 
      courseScheduleId: selectedCourseSchedule.id,
      courseSchedule: selectedCourseSchedule 
    });
  };

  const handleDropOut = () => {
    setMenuVisible(false);
    navigation.navigate('DropOutCourse', { id: course.id, currentId: currentCourseId });
  };

  const confirmDropOutAction = async () => {
    setConfirmDropOut(false);
    try {
      // Try dropping out to credit card first, then to app balance as fallback
      await dropOutOfCourseToCreditCard(selectedCourseSchedule.id);
      setAlert({ visible: true, title: 'Baja exitosa', message: 'Te has dado de baja del curso. El reembolso se procesará a tu tarjeta de crédito.' });
      // Refresh user data to update course lists
      queryClient.invalidateQueries(['whoAmI']);
    } catch (err) {
      try {
        await dropOutOfCourseToAppBalance(selectedCourseSchedule.id);
        setAlert({ visible: true, title: 'Baja exitosa', message: 'Te has dado de baja del curso. El reembolso se acreditará a tu saldo en la app.' });
        // Refresh user data to update course lists
        queryClient.invalidateQueries(['whoAmI']);
      } catch (appBalanceErr) {
        setAlert({ visible: true, title: 'Error', message: 'No se pudo procesar la baja del curso.' });
      }
    }
  };

  const showOptionsMenu = (courseSchedule) => {
    setSelectedCourseSchedule(courseSchedule);
    setMenuVisible(true);
  };

  const renderCourseScheduleList = (courseSchedules) => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />;
    }
    if (!courseSchedules || courseSchedules.length === 0) {
      return <Text style={styles.emptyText}>No se encontraron cursos.</Text>;
    }
    return (
      <ScrollView contentContainerStyle={styles.list}>
        {courseSchedules.map(courseSchedule => (
          <View key={courseSchedule.id} style={styles.courseScheduleContainer}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('Curso', { id: courseSchedule.course.id })}
            >
              <StudentCourseCard 
                courseSchedule={courseSchedule}
              />
            </Pressable>
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => showOptionsMenu(courseSchedule)}
            >
              <MaterialIcons name="more-vert" size={24} color="#888" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Mis Cursos</PageTitle>
            
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.tabButtonActive]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 0 && styles.tabButtonTextActive]}>En curso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.tabButtonActive]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 1 && styles.tabButtonTextActive]}>Finalizados</Text>
        </TouchableOpacity>
      </View>

      {/* Course content */}
      <View style={styles.contentContainer}>
        {selectedTab === 0
          ? renderCourseScheduleList(ongoingCourses)
          : renderCourseScheduleList(finishedCourses)}
      </View>

      <Pressable
        style={styles.assistButton}
        onPress={() => navigation.navigate('QRScan')}
      >
        <MaterialIcons name="qr-code-scanner" size={24} color={colors.background} />
        <Text style={styles.assistButtonText}>
          Marcar asistencia
        </Text>
      </Pressable>

      {/* Options Modal */}
      <OptionsModal
        visible={menuVisible}
        options={[
          { label: 'Ver asistencia', onPress: handleViewAttendance },
          { label: 'Dar de baja', onPress: handleDropOut, textStyle: { color: colors.danger }},
        ]}
        onRequestClose={() => setMenuVisible(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmDropOut}
        title="¿Estás seguro?"
        message="¿Deseas darte de baja de este curso? Esta acción no se puede deshacer."
        onConfirm={confirmDropOutAction}
        onCancel={() => setConfirmDropOut(false)}
        confirmLabel="Dar de baja"
        cancelLabel="Cancelar"
        confirmColor={colors.danger}
        cancelColor={colors.secondaryBackground}
        onRequestClose={() => setConfirmDropOut(false)}
      />

      {/* Alert Modal */}
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  contentContainer: {
    flex: 1,
  },
  assistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  assistButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonText: {
    color: colors.mutedText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabButtonTextActive: {
    color: colors.background,
  },
  courseScheduleContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  list: {
    paddingBottom: 80, // Add padding to avoid content being hidden behind the fixed button
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 48,
  },
});
