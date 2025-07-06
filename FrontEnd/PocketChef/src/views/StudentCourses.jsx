import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setCourses(user.studentProfile.currentCourses);
    console.log('Courses:', user.studentProfile.currentCourses);
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
          {courses.length === 0 ? (
            <Text style={styles.emptyText}>No se encontraron cursos.</Text>
          ) : (
            courses.map(course => (
              <Pressable
                key={course.course.id}
                style={{ marginBottom: 8 }}
                onPress={() => navigation.navigate('Curso', { id: course.course.id })}
              >
                <CourseCard course={course.course} id={course.course.id} />
              </Pressable>
            ))
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
});
