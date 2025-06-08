import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotonCircularBlanco from '../components/BotonCircularBlanco'; 
import BackArrow from '../../assets/BackArrow.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';
import { getCourseById } from '../services/courses.js';
import { getCourseSchedulesByCourseId } from '../services/course-schedules';

const windowWidth = Dimensions.get('window').width;

export default function Curso({ route, navigation: navProps }) {
  const [curso, setCurso] = useState(null);
  const [photo, setPhoto] = useState("");
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [imageAspectRatio, setImageAspectRatio] = useState(4 / 3);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState(null);

  const id = route?.params?.id;

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
      const data = await getCourseById(id);
      console.log('Curso:', data);
      setCurso(data);
      setPhoto(data.coursePhoto);
      
      // Calculate aspect ratio for the image
      if (data.coursePhoto) {
        Image.getSize(
          data.coursePhoto,
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
      const data = await getCourseSchedulesByCourseId(id);
      console.log('Schedules:', data);
      setSchedules(data);
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

          <SafeAreaView style={styles.cursoDeParent}>
            <Text style={styles.cursoDe}>Curso dictado por</Text>
            
            <View style={styles.professorInfo}>
              <Image
                style={styles.fotoDePerfil} 
                resizeMode="cover"
                source={{ 
                  uri: schedules?.[0]?.professorPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' 
                }}
              />
              <View style={styles.professorDetails}>
                <Text style={styles.nombre}>
                  {schedules && schedules[0]?.professorName || 'Profesor'}
                </Text>
              </View>
            </View>
          </SafeAreaView>

          {/* Sección de Descripción */}
          <SafeAreaView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descripcionText}>{curso.contents || 'Sin descripción adicional.'}</Text>
          </SafeAreaView>

          {/* Sección de Información del Curso */}
          <SafeAreaView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Información del Curso</Text>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="calendar-today" size={18} color="#65bcb5" />
              <Text style={styles.infoText}>Inicio de la cursada: {new Date(curso.courseSchedules[0].startDate).toLocaleDateString()}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="computer" size={18} color="#65bcb5" />
              <Text style={styles.infoText}>Modalidad: {curso.modality}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={18} color="#65bcb5" />
              <Text style={styles.infoText}>Duración: {curso.duration} horas</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="attach-money" size={18} color="#65bcb5" />
              <Text style={styles.infoText}>Precio: ${curso.price}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="assignment" size={18} color="#65bcb5" />
              <Text style={styles.infoText}>Requerimientos: {curso.requirements}</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContainer: {
    flex: 1,
    zIndex: 2,
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
    minHeight: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },

  titulo: {
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: "600",
    fontFamily: "Roboto Flex",
    color: "#000",
    textAlign: "left",
    marginTop: 10,
    marginBottom: 8,
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
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 22,
    letterSpacing: 0.6,
    fontWeight: "600",
    fontFamily: "Roboto Flex",
    color: "#000",
    marginBottom: 15,
  },

  descripcionText: {
    fontSize: 16,
    fontFamily: "RobotoFlex-Regular",
    color: "#555",
    textAlign: "justify",
    lineHeight: 24,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },

  infoText: {
    fontSize: 16,
    fontFamily: "RobotoFlex-Regular",
    color: "#333",
    flex: 1,
  },
});