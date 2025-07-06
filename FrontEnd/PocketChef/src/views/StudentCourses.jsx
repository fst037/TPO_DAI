import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { getUserById } from '../services/users';
import { getStudentById } from '../services/students';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { getUserIdFromToken } from '../utils/jwt';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import CourseCard from '../components/course/CourseCard';

export default function StudentCourses({ navigation }) {
  const [studentId, setStudentId] = useState(undefined);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [finishedCourses, setFInishedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Cursando, 1: Finalizados

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
  if (user?.studentProfile?.currentCourses) {
    setLoading(true);
    setCurrentCourses(user.studentProfile.currentCourses);
    setFInishedCourses(user.studentProfile.finishedCourses);
    console.log('Current Courses:', user.studentProfile.currentCourses);
    console.log('Finished Courses:', user.studentProfile.finishedCourses);
    setLoading(false);
  }
}, [user]);

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Mis Cursos</PageTitle>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        
        <ScrollView contentContainerStyle={styles.list}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 0 && styles.tabButtonActive]}
              onPress={() => setSelectedTab(0)}
            >
              <Text style={[styles.tabButtonText, selectedTab === 0 && styles.tabButtonTextActive]}>Cursando</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 1 && styles.tabButtonActive]}
              onPress={() => setSelectedTab(1)}
            >
              <Text style={[styles.tabButtonText, selectedTab === 1 && styles.tabButtonTextActive]}>Finalizados</Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 0 ? (
            currentCourses.length === 0 ? (
              <Text style={styles.emptyText}>No se encontraron cursos.</Text>
            ) : (
              currentCourses.map(course => (
                <Pressable
                  key={course.course.id}
                  style={{ marginBottom: 8 }}
                  onPress={() => navigation.navigate('Curso', { id: course.course.id })}
                >
                  <CourseCard course={course.course} id={course.course.id} />
                </Pressable>
              ))
            )
          ) : (
            finishedCourses.length === 0 ? (
              <Text style={styles.emptyText}>No se encontraron cursos.</Text>
            ) : (
              finishedCourses.map(course => (
                <Pressable
                  key={course.course.id}
                  style={{ marginBottom: 8 }}
                  onPress={() => navigation.navigate('Curso', { id: course.course.id })}
                >
                  <CourseCard course={course.course} id={course.course.id} />
                </Pressable>
              ))
            )
          )}
        </ScrollView>
      )}
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
  list: {
    paddingBottom: 32,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 48,
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
});
