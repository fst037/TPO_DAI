import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Text, Animated, SafeAreaView, ScrollView} from 'react-native';
import CalculoIng from '../components/CalculoIng';
import BotonCircularBlanco from '../components/BotonCircularBlanco';
import BackArrow from '../../assets/BackArrow.svg';
import heartBlack from '../../assets/heartBlack.svg';
import Hour from '../../assets/Hour.svg';
import StarPintada from '../../assets/StarPintada.svg';
import StarNoPintada from '../../assets/StarNoPintada.svg';
import Instructions from '../../assets/Instructions';
import { useNavigation } from '@react-navigation/native';
import { getRecipeById } from '../services/recipes';

export default function Receta({id}) {
    const scrollY = useRef(new Animated.Value(0)).current; 
    const [receta, setReceta] = useState(null);
    const [photo, setPhoto] = useState("");
    const navigation = useNavigation();

    const handleGetRecipeById = async (id) => {
      try {
        const data = await getRecipeById(id); 
        console.log('Receta recibida:', data);
        setReceta(data);

        if (data.photos?.length > 0) {
          setPhoto(data.photos[0].photoUrl);
        }
      } catch (error) {
        console.error('Error al obtener la receta:', error);
        setAlert({
          visible: true,
          title: 'Error al cargar receta',
          message: 'No se pudo cargar la receta. Intentalo más tarde.'
        });
      }
    };


    useEffect(() => {
      if (id) {
        handleGetRecipeById(id);
      }
    }, [id]);

  const StarRating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarPintada key={i} width={14} height={14} style={styles.star} />
        ) : (
          <StarNoPintada key={i} width={14} height={14} style={styles.star} />
        )
      );
    }

    return <View style={styles.starRow}>{stars}</View>;
  };

  if (!receta) {
    return <Text>Cargando...</Text>;
  }
    return (
        <View style={styles.container}>
            
            <Image
                style={[
                    styles.imagenComida,
                    {
                    transform: [{ scale: 1.5 }], 
                    },
                ]}
                source={{
                uri: photo
                }}
                resizeMode="cover" 
            />
            
            <Animated.ScrollView
                style={styles.scrollContainer}
                onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false } 
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.rowContainer}>
                    <BotonCircularBlanco
                      IconComponent={BackArrow}
                      onPress={() => navigation.goBack()}
                      style={styles.botonRowContainer} 
                    />
                    <BotonCircularBlanco
                      IconComponent={heartBlack}
                      onPress={() => console.log('Otro botón')}
                      style={styles.botonRowContainer}
                    />
                  </View>

                <View style={styles.espacio} />
                
                
                <Animated.View 
                    style={[
                        styles.fondoBlanco,
                        {
                        marginTop: scrollY.interpolate({
                            inputRange: [0, 300], 
                            outputRange: [0, -150], 
                            extrapolate: 'clamp',
                        })
                        }
                    ]}
                    >
                    <Text style={styles.subtitulo}>{receta.recipeType.description}</Text>
                    <Text style={styles.titulo}>{receta.recipeName}</Text>
                    
                    <SafeAreaView style={styles.recetaDeParent}>
                        <Text style={[styles.recetaDe, styles.recetaDeFlexBox]}>Receta de</Text>
                        <Text style={[styles.nombre, styles.verPerfilTypo]}>{receta.user.nickname}</Text>
                        <Text style={[styles.verPerfil, styles.verPerfilTypo]}>Ver perfil</Text>
                        <Image style={styles.fotoDePerfil} resizeMode="cover" source={{ uri: receta.user.avatar }} />
                    </SafeAreaView>
                    
                    <SafeAreaView style={styles.descripcinParent}>
                        
                        <Text style={styles.descripcin}>Descripción</Text>
                        <Text style={styles.recipeDescription}>{receta.recipeDescription}</Text>
                    </SafeAreaView>

                    <SafeAreaView style={styles.groupParent}>
                      <View style={styles.rectangleParent}>
                        <View style={styles.groupChild} />
                        <View style={styles.contentRow}>
                          <Hour width={20} height={20} style={{ marginRight: 8 }} />
                          <View>
                            <Text style={styles.tiempoDeCoccion}>Tiempo de cocción</Text>
                            <Text style={styles.min}>{receta.cookingTime} min</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.rectangleGroup}>
                        <View style={styles.groupChild} />
                        <Text
                            style={[
                              styles.text,
                              { left: receta.averageRating < 10 && Number.isInteger(receta.averageRating) ? 15 : 10 }
                            ]}
                          >
                            {Number.isInteger(receta.averageRating)
                              ? receta.averageRating
                              : receta.averageRating.toFixed(1)}
                        </Text>

                        <View style={styles.reviewContainer}>
                          <StarRating rating={Math.round(receta.averageRating)} />
                          <Text style={styles.reviews}>(4 reviews)</Text>
                        </View>
                      </View>
                    </SafeAreaView>

                    <CalculoIng usedIngredients={receta.usedIngredients} people={receta.numberOfPeople} servings={receta.servings} />

                    <SafeAreaView style={styles.instruccionesParent}>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Instructions width={30} height={30} />
                        <Text style={styles.tituloInstrucciones}>Instrucciones</Text>
                      </View>

                      {receta.steps.map((step) => (
                        <View key={step.id} style={styles.pasoContainer}>
                          <Text style={styles.pasoTexto}>
                            {`${step.stepNumber}. ${step.text}`}
                          </Text>
                          
                          {step.multimedia.length > 0 && (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.imagenesScroll1}
                              style={styles.imagenesScroll}
                            >
                              {step.multimedia.map((url, index) => (
                                <Image
                                  key={index}
                                  source={{ uri: url.contentUrl }} 
                                  style={styles.pasoImagen}
                                  resizeMode="cover"
                                />
                              ))}
                            </ScrollView>
                          )}

                        </View>
                      ))}
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
  imagenComida: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 450,
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  espacio: {
    height: 400, 
    backgroundColor: 'transparent',
  },
  fondoBlanco: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    width: 353,
    marginTop: 10,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 20,
    letterSpacing: 0.6,
    fontFamily: "RobotoFlex-Regular",
    color: "#797979",
    textAlign: "left",
    width: 92,
    marginBottom: 4,
  },
  subtitulo2: {
    fontSize: 20,
    letterSpacing: 0.6,
    fontWeight: "500",
    fontFamily: "Roboto Flex",
    color: "#000",
    textAlign: "justify",
    width: 223,
    marginBottom: 8,
  },
  recetaDeParent: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 110,
  },
  recetaDe: {
    top: 0,
left: 0,
fontSize: 20,
letterSpacing: 0.6,
fontWeight: "500",
width: 223,
height: 32,
fontFamily: "Roboto Flex",
alignItems: "center",
display: "flex",
textAlign: "justify",
color: "#000",
position: "absolute"
  },
  nombre: {
    top: 53,
fontSize: 15,
letterSpacing: 0.5,
width: 145,
height: 15,
alignItems: "center",
display: "flex",
textAlign: "justify",
color: "#000"
  },
  verPerfil: {
    top: 74,
fontSize: 13,
textDecorationLine: "underline",
letterSpacing: 0.4,
color: "#65bcb5",
textAlign: "left",
width: 79,
height: 24
  },
  fotoDePerfil: {
    top: 36,
left: 1,
width: 64,
height: 64,
position: "absolute",
borderRadius:35
  },
  recetaDeFlexBox: {
    alignItems: "center",
display: "flex",
textAlign: "justify",
color: "#000"
  },
  verPerfilTypo: {
    fontWeight: "600",
left: 85,
fontFamily: "Roboto Flex",
position: "absolute"
  },
  descripcinParent: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  descripcin: {
    fontSize: 20,
    letterSpacing: 0.6,
    fontWeight: "500",
    fontFamily: "Roboto Flex",
    color: "#000",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 17,
    fontFamily: "RobotoFlex-Regular",
    color: "#797979",
    textAlign: "justify",
    marginBottom: 20,
  },

  //Los dos rectangulos: Tiempo de coccion y Reviews
  groupParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 61,
  },

  rectangleParent: {
    width: 132,
    height: 61,
    position: "relative",
  },

  rectangleGroup: {
    width: 132,
    height: 61,
    position: "relative",
  },

  groupChild: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#d9d9d9",
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
  },

  min: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ed802a",
  },

  tiempoDeCoccion: {
    fontSize: 11,
    fontWeight: "500",
    color: "#000",
  },

  text: {
    position: "absolute",
    top: 15,
    left: 5,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Roboto Flex",
    textAlign: "center",
  },

  reviewContainer: {
    position: "absolute",
    top: 15,
    left: 45,
    flexDirection: "column",
    alignItems: "center",
  },

  reviews: {
    fontSize: 17,
    fontWeight: "500",
    color: "#ed802a",
    fontFamily: "Roboto Flex",
    textAlign: "center",
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 3,
  },

  ininstruccionesParent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  tituloInstrucciones: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom:5,
    fontFamily: 'Roboto Flex',
    color: '#000',
    marginLeft: 10
  },

  pasoContainer: {
    marginBottom: 10,
  },

  pasoTexto: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'RobotoFlex-Regular',
    textAlign: 'justify',
    color: '#000',
    marginBottom: 8,
  },

  imagenesScroll: {
    maxHeight: 130,
  },

  imagenesScroll1: {
    flexDirection: 'row',
  },

  pasoImagen: {
    width: 200,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
      rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginTop: 50,
      paddingHorizontal: 15,
},
  botonRowContainer: {
    marginRight: 15,         
  },
  circulo: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    borderRadius: 20,          
    alignItems: 'center',      
    justifyContent: 'center', 
  },
});