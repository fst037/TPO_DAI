import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getFilteredRecipes } from '../services/recipes';
import { getAllCourses, filterCourses } from '../services/courses';
import CourseSearchBar from '../components/course/CourseSearchBar'; 
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import RecipeSearchBar from '../components/recipe/RecipeSearchBar';
import RecipeCard from '../components/recipe/RecipeCard';
import { FontFamily } from '../GlobalStyles';

export default function Courses ({ navigation }) {
  const route = useRoute();
  const initialFilters = route.params?.initialFilters || {};
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch filtered recipes from backend
  const fetchFiltered = async (filterObj) => {
    setLoading(true);
    try {
      const filterParams = {
        ...filterObj
      };
      // Clean up empty arrays/fields
      Object.keys(filterParams).forEach(k => {
        if (Array.isArray(filterParams[k]) && filterParams[k].length === 0) delete filterParams[k];
        if (filterParams[k] === '' || filterParams[k] == null) delete filterParams[k];
      });

      console.log('Fetching courses with filters:', filterParams);     

      let res;
      if (Object.keys(filterParams).length === 0) {
        // No filters: get all courses
        res = await getAllCourses();
      } else {
        // Filters present: filter courses
        res = await filterCourses(filterParams);
      }
      setCourses(res.data || []);

    } catch (err) {
      if (err.response) {
        console.log('Error response:', err.response.data, 'Status:', err.response.status, 'Headers:', err.response.headers);
      } else if (err.request) {
        console.log('No response received:', err.request);
      } else {
        console.log('Error setting up request:', err.message);
      }
      
      setCourses([]);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    if (initialFilters) {
      fetchFiltered(initialFilters);
    } else {
      fetchFiltered({});
    }    
  }, []);

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Cursos</PageTitle>
      <CourseSearchBar
        initialFilters={initialFilters}
        onSearch={fetchFiltered}
      />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {courses.length === 0 ? (
            <Text style={styles.emptyText}>No se encontraron cursos.</Text>
          ) : (
            courses.map(course => (
              <Pressable
                key={course.id}
                style={{ marginBottom: 8 }}
                onPress={() => navigation.navigate('Curso', { id: course.id })}
              >
                <CourseCard course={course} />
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
