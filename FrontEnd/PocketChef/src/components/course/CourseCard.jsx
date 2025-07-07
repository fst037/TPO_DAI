import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsModal from '../global/modals/OptionsModal';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import AlertModal from '../global/modals/AlertModal';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteRecipe } from '../../services/recipes';
import { useQueryClient } from '@tanstack/react-query';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { getCourseById } from '../../services/courses.js';

export default function CourseCard({ course, id = -1, currentCourseId = -1 }) {

  const [courseData, setCourseData] = useState(course || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourseData(response.data);
        if (currentCourseId !==- 1){
          setIsMine(true);
        }
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el curso.');
      }
    };

    if (id !== -1) {
      fetchCourse();
    }
  }, [id]);

  const { coursePhoto, description, duration, modality, courseSchedules, contents, price } = courseData;

  const [isMine, setIsMine] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();
  const navigation = useNavigation();


  const handleViewAssistance = () => {
    //ToDo
    setMenuVisible(false);
  };

    const handleDropOut = () => {
      setMenuVisible(false);
      navigation.navigate('DropOutCourse', { id: course.id, currentId: currentCourseId });
  };

  const confirmDeleteRecipe = async () => {
    setConfirmDelete(false);
    try {
      await deleteRecipe(recipe.id);
      // setAlert({ visible: true, title: 'Receta eliminada', message: 'La receta ha sido eliminada.' });
      queryClient.invalidateQueries(['recipes']);
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo eliminar la receta.' });
    }
  };

  // Check if user is a student
  useEffect(() => {
    const checkIsStudent = async () => {
      try {
        const isStudent = await AsyncStorage.getItem('isStudent');
        if (isStudent === 'true') {
          setIsStudent(true);
        }
      } catch (e) {
        // handle error silently
      }
    };
    checkIsStudent();
  }, []);

  const handleNavigation = (courseId) => {
    if (isStudent) {
      navigation.navigate('Curso', { id: course.id });
    } else {
      navigation.navigate('StudentRegister')
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handleNavigation(course.id)}
      style={styles.touchable}
    >
      <View style={styles.cardRow}>
        <View style={styles.leftImageContainer}>
          {coursePhoto ? (
            <Image source={{ uri: coursePhoto }} style={styles.leftImage} />
          ) : (
            <View style={[styles.leftImage, { backgroundColor: '#eee' }]} />
          )}
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.title} numberOfLines={1}>{description}</Text>
          <Text style={styles.info} numberOfLines={4}>
            {contents}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Curso', { id: course.id })}>
            <Text style={styles.link}>Leer más</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.bottomRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="attach-money" size={18} color="#888" />
              <Text style={styles.metaText}>{price}</Text>
            </View>
            <View
              style={[
                styles.metaItem,
                modality.length > 9 && { marginLeft: -5, marginRight: 0 }
              ]}
            >
              <MaterialIcons name="computer" size={18} color="#888" />
              <Text style={styles.metaText}>{modality}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={18} color="#888" />
              <Text style={styles.metaText}>{duration}hr.</Text>
            </View>
          </View>
        </View>
        {isMine && (
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="more-vert" size={24} color="#888" />
        </TouchableOpacity>
        )}
      </View>
      <OptionsModal
        visible={menuVisible}
        options={[
          { label: 'Ver asistencia', onPress: handleViewAssistance },
          { label: 'Dar de baja', onPress: handleDropOut, textStyle: { color: colors.danger }},
        ]}
        onRequestClose={() => setMenuVisible(false)}
      />
      <ConfirmationModal
        visible={confirmDelete}
        title="¿Estás seguro?"
        message="Esta acción no se puede deshacer."
        onConfirm={confirmDeleteRecipe}
        onCancel={() => setConfirmDelete(false)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmColor={colors.danger}
        cancelColor={colors.terciary}
        onRequestClose={() => setConfirmDelete(false)}
      />
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryBackground, 
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    alignItems: 'stretch',
    minHeight: 170,
    height: 170,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#B0B0B0', 
  },
  leftImageContainer: {
    width: 120,
    height: 170,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.secondaryBackground,
  },
  leftImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
    height: 170,
    position: 'relative', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 2,
    maxHeight: 26,
  },
  info: {
    fontSize: 15,
    color: colors.inputBorder || '#B0B0B0', 
    marginBottom: 0,
    maxHeight: 70, 
    overflow: 'hidden',
  },
  link: {
    color: '#53B9B1', 
    fontSize: 15,
    marginBottom: 6,
    textDecorationLine: 'underline',
    maxHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.inputBorder || '#B0B0B0', 
    borderRadius: 1,
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 38,
    marginVertical: 0,
    marginBottom: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'space-around',
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 22,
    minHeight: 22,
    maxHeight: 22,
    overflow: 'hidden',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    height: 22,
    minHeight: 22,
    maxHeight: 22,
    overflow: 'hidden',
  },
  metaText: {
    fontSize: 13,
    color: colors.clickableText, 
    marginLeft: 2,
    lineHeight: 18,
    paddingTop: 0,
    paddingBottom: 0,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: colors.secondaryBackground,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    elevation: 2,
  },
  ratingText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 15,
    marginRight: 2,
  },
  ratingCount: {
    color: colors.secondaryText,
    fontSize: 13,
  },
  infoBox: {
    padding: 14,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 14, 
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 64,
    width: '100%',
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 2,
    zIndex: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDots: {
    fontSize: 24,
    color: colors.secondaryText,
    fontWeight: 'condensedBold',
  },
});

