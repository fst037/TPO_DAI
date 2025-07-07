import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, SafeAreaView, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotonCircularBlanco from '../components/BotonCircularBlanco'; 
import BackArrow from '../../assets/BackArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';
import { getCourseById } from '../services/courses.js';
import { getCourseSchedulesByCourseId } from '../services/course-schedules';
import CourseScheduleCard from '../components/course/CourseScheduleCard';
import PrimaryButton from '../components/global/inputs/PrimaryButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Curso({ route}) {
  const [curso, setCurso] = useState(null);
  const [photo, setPhoto] = useState("");
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 3);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const {id} = route.params;

  // Configurar las opciones de navegación para habilitar el gesto de swipe back
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: true, // Habilita el gesto de swipe back
      gestureDirection: 'horizontal', // Dirección del gesto
      // Opcional: personalizar el gesto
      gestureResponseDistance: {
        horizontal: 50, // Distancia desde el borde para activar el gesto
      },
    });
  }, [navigation]);

  const handleGetCourseById = async () => {
  try {
    const response = await getCourseById(id);
    console.log('Curso:', response.data); // Accede a response.data
    setCurso(response.data); // Guarda solo los datos
    setPhoto(response.data.coursePhoto);
    
    // Calculate aspect ratio for the image
    if (response.data.coursePhoto) {
      Image.getSize(
        response.data.coursePhoto,
        (width, height) => {
          if (width && height) {
            setImageAspectRatio(width / height);
          }
        },
        (err) => {
          setImageAspectRatio(4 / 3); // fallback
        }
      );
    }
  } catch (e) {
    console.error(e);
    setAlert({ visible: true, title: 'Error', message: 'No se pudo cargar el curso.' });
  }
};

  const handleGetSchedules = async () => {
  try {
    const response = await getCourseSchedulesByCourseId(id);
    console.log('Schedules:', response.data); // Accede a response.data
    setSchedules(response.data); // Guarda solo los datos
  } catch (e) {
    console.error(e);
  }
};

  useEffect(() => {
    if (id) {
      handleGetCourseById();
      handleGetSchedules();  
    }
  }, [id]);

  const handleScheduleSelect = (scheduleId) => {
    setSelectedScheduleId(selectedScheduleId === scheduleId ? null : scheduleId);
  };

  const handleEnrollPress = () => {
    if (selectedScheduleId) {
      const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
      navigation.navigate('ConfirmEnrollment', { 
        courseScheduleId: selectedScheduleId,
        schedule: selectedSchedule 
      });
    }
  };

  if (!curso) {
    return (
      <View style={styles.container}>
        <Text>Cargando curso...</Text>
      </View>
    );
  }

  // Calculate image height based on aspect ratio
  const imageHeight = windowWidth / imageAspectRatio;

  return (
    <View style={styles.container}>
      {/* Status bar color lip */}
      <View style={{ height: 44, backgroundColor: colors.secondary, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }} />

      <Animated.ScrollView
        style={[styles.scrollContainer, { zIndex: 2 }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        // Importante: Permitir que el ScrollView detecte gestos horizontales
        scrollEnabled={true}
        bounces={true}
      >
        {photo && (
          <View style={{ position: 'relative', marginTop: 44 }}>
            <Image
              source={{ uri: photo }}
              style={{
                width: windowWidth,
                height: imageHeight,
                resizeMode: 'cover'
              }}
            />
          </View>
        )}

        <Animated.View
          style={[
            styles.fondoBlanco,
            { marginTop: -32 }
          ]}
        >
          <Text style={styles.titulo}>{curso.description}</Text>

          {/* Sección de Descripción */}
          <SafeAreaView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descripcionText}>{curso.contents || 'Sin descripción adicional.'}</Text>
          </SafeAreaView>

          {/* Sección de Información del Curso */}
          <SafeAreaView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Información del Curso</Text>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="computer" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Modalidad: {curso.modality}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Duración: {curso.duration} horas</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="attach-money" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Precio: ${curso.price?.toLocaleString()}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="assignment" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Requerimientos: {curso.requirements}</Text>
            </View>
          </SafeAreaView>

          {/* Sección de Horarios Disponibles */}
          {schedules && schedules.length > 0 && (
            <SafeAreaView style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
              <View style={styles.schedulesContainer}>
                <ScrollView 
                  style={styles.schedulesScrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {schedules.map((schedule) => (
                    <TouchableOpacity
                      key={schedule.id}
                      activeOpacity={0.8}
                      onPress={() => handleScheduleSelect(schedule.id)}
                    >
                      <View style={styles.scheduleCardWrapper}>
                        <CourseScheduleCard 
                          schedule={schedule} 
                          navigation={navigation}
                          hideEnrollButton={true}
                          style={selectedScheduleId === schedule.id ? styles.selectedScheduleCard : null}
                        />
                        {selectedScheduleId === schedule.id && (
                          <View style={styles.selectedIndicator}>
                            <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Enrollment Button */}
              <PrimaryButton
                title="Inscribirme"
                onPress={handleEnrollPress}
                disabled={!selectedScheduleId}
                style={[
                  styles.enrollButton,
                  !selectedScheduleId && styles.enrollButtonDisabled
                ]}
              />
            </SafeAreaView>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: Dimensions.get('window').height,
  },

  scrollContainer: {
    flex: 1,
    zIndex: 2,
    backgroundColor: '#fff',
  },

  topButtonOverImage: {
    position: 'absolute',
    top: 6,
    left: 15,
    zIndex: 20,
  },

  botonRowContainer: {
    // No additional margin needed       
  },

  fondoBlanco: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 25,
    shadowRadius: 6,
    elevation: 10,
  },

  titulo: {
    fontSize: 34,
    letterSpacing: 1,
    fontWeight: "700",
    fontFamily: "Roboto Flex",
    color: colors.clickableText,
    textAlign: "left",
    marginTop: 10,
    marginBottom: 16,
  },

  cursoDeParent: {
    width: "100%",
    marginBottom: 30,
  },

  cursoDe: {
    fontSize: 20,
    letterSpacing: 0.6,
    fontWeight: "500",
    fontFamily: "Roboto Flex",
    color: "#000",
    marginBottom: 15,
  },

  professorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  fotoDePerfil: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  professorDetails: {
    flex: 1,
  },

  nombre: {
    fontSize: 15,
    letterSpacing: 0.5,
    fontFamily: "Roboto Flex",
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },

  sectionContainer: {
    width: "100%",
  },

  sectionTitle: {
    fontSize: 26,
    letterSpacing: 0.6,
    fontWeight: "700",
    fontFamily: "Roboto Flex",
    color: colors.clickableText,
    marginBottom: 18,
  },

  descripcionText: {
    fontSize: 18,
    fontFamily: "RobotoFlex-Regular",
    color: colors.secondaryText,
    textAlign: "justify",
    lineHeight: 26,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  infoText: {
    fontSize: 18,
    fontFamily: "RobotoFlex-Regular",
    color: colors.clickableText,
    flex: 1,
    fontWeight: '500',
  },

  schedulesScrollView: {
    maxHeight: windowHeight * 0.5, // 50% of window height
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  schedulesContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.background,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },

  scheduleCardWrapper: {
    position: 'relative',
    marginBottom: 8, // Add some space between cards
  },

  selectedScheduleCard: {
    backgroundColor: colors.primaryBackground || colors.lightBackground,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },

  selectedIndicator: {
    position: 'absolute',
    bottom: 24,
    right: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  enrollButton: {
    marginTop: 8,
  },

  enrollButtonDisabled: {
    opacity: 0.5,
  },
});