import { useRef, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Animated, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import CalculoIng from '../components/CalculoIng';
import Hour from '../../assets/Hour.svg';
import StarPintada from '../../assets/StarPintada.svg';
import StarNoPintada from '../../assets/StarNoPintada.svg';
import Instructions from '../../assets/Instructions.svg';
import { useRoute } from '@react-navigation/native';
import { getDownloadedRecipeById } from '../services/downloads';
import colors from '../theme/colors';
import AlertModal from '../components/global/modals/AlertModal';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import ProtectLoggedIn from '../components/global/ProtectLoggedIn';

const windowWidth = Dimensions.get('window').width;

export default function RecipeOffline(props) {
    // All hooks at the top level, before any logic or returns
    const scrollY = useRef(new Animated.Value(0)).current;
    const [photo, setPhoto] = useState("");
    const [imageAspectRatios, setImageAspectRatios] = useState({});
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [stepImageIndexes, setStepImageIndexes] = useState({});
    const [isMine, setIsMine] = useState(false);
    const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
    const route = useRoute();

    // Prefer prop, fallback to route.params
    const id = props.id ?? route.params?.id;

    // Offline: get recipe from localStorage
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      (async () => {
        try {
          const data = await getDownloadedRecipeById(id);          
          
          setRecipe(data);
          if (data?.photos?.length > 0) {
            setPhoto(data.photos[0].photoUrl);
          }
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
        }
      })();
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

    // Combine mainPhoto and recipe.photos for the main slider, memoized for stability
    const mainImages = useMemo(() => {
      let imgs = [];
      if (recipe?.mainPhoto) imgs.push({ url: recipe.mainPhoto });
      if (recipe?.photos && Array.isArray(recipe.photos)) {
        recipe.photos.forEach(photo => {
          if (!imgs.some(img => img.url === photo.photoUrl)) {
            imgs.push({ url: photo.photoUrl });
          }
        });
      }
      return imgs;
    }, [recipe]);

    // Calculate aspect ratios for all images in mainImages
    useEffect(() => {
      mainImages.forEach(img => {
        if (!imageAspectRatios[img.url]) {
          Image.getSize(
            img.url,
            (width, height) => {
              if (width && height) {
                setImageAspectRatios(prev => ({ ...prev, [img.url]: width / height }));
              }
            },
            (err) => {
              setImageAspectRatios(prev => ({ ...prev, [img.url]: 4 / 3 })); // fallback
            }
          );
        }
      });
    }, [mainImages]);

    // Reset mainImageIndex and imageAspectRatios when recipe changes to avoid hook order issues
    useEffect(() => {
      setImageAspectRatios({});
      setMainImageIndex(0);
    }, [recipe]);

    // Ensure mainImageIndex is always valid when mainImages changes
    useEffect(() => {
      if (mainImageIndex >= mainImages.length) {
        setMainImageIndex(0);
      }
    }, [mainImages.length]);

    // Show loading state on both initial load and refetch
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando receta...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Error al cargar la receta.</Text>
        </View>
      );
    }

    if (!recipe) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Receta no encontrada.</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* AlertModal for error feedback */}
        <AlertModal
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ visible: false, title: '', message: '' })}
          onRequestClose={() => setAlert({ visible: false, title: '', message: '' })}
        />

        {/* Lip color for status bar area */}
        <View style={{ height: 44, backgroundColor: colors.secondary, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }} />

        <Animated.ScrollView
            style={[styles.scrollContainer, { zIndex: 2 }]}
            onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        >
            {/* Main image slider should scroll away with content */}
            {mainImages.length > 0 && (
              <View style={{ position: 'relative', marginTop: 44 }}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  decelerationRate="fast"
                  snapToAlignment="center"
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagenComida}
                  onScroll={e => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / (windowWidth));
                    if (mainImageIndex !== index) setMainImageIndex(index);
                  }}
                  scrollEventThrottle={16}
                >
                  {mainImages.map((img, idx) => {
                    // Only the current image should have its calculated height, others should be height: 0
                    const isCurrent = idx === mainImageIndex;
                    const aspect = imageAspectRatios[img.url] || 4 / 3;
                    const imgHeight = isCurrent ? windowWidth / aspect : 0;
                    return (
                      <Image
                        key={idx}
                        source={{ uri: img.url }}
                        style={{ width: windowWidth, height: imgHeight, resizeMode: 'cover' }}
                      />
                    );
                  })}
                </ScrollView>
                <View style={styles.dotsOverlayContainer}>
                  {mainImages.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        mainImageIndex === idx ? styles.dotActive : null
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            <Animated.View
                style={[
                    styles.fondoBlanco,
                    { marginTop: -32 }
                ]}
            >
                <Text style={[styles.subtitulo]}>{recipe?.recipeType?.description || 'Sin tipo'}</Text>
                <Text style={[styles.titulo]}>{recipe?.recipeName || 'Sin nombre'}</Text>

                <View style={styles.userRow}>
                  {recipe?.user?.avatar ? (
                    <TouchableOpacity
                      onPress={async () => {}}
                    >
                      <Image source={{ uri: recipe?.user?.avatar }} style={styles.avatar} />
                    </TouchableOpacity>
                  ) : null}
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.userNick}>{recipe?.user?.email}</Text>
                  </View>
                </View>

                <Text style={[styles.description]}>Descripción</Text>
                <Text style={[styles.recipeDescription]}>{recipe?.recipeDescription}</Text>

                <View style={styles.groupParent}>
                  <View style={styles.rectangleBox}>
                    <Hour width={24} height={24} style={{ marginRight: 10 }} />
                    <View>
                      <Text style={styles.tiempoDeCoccion}>Tiempo de cocción</Text>
                      <Text style={styles.min}>{recipe?.cookingTime ? `${recipe?.cookingTime} min` : 'Sin tiempo'}</Text>
                    </View>
                  </View>

                  <ProtectLoggedIn onPress={() => {}} style={styles.rectangleBox}>
                    <Text style={[styles.text, { marginRight: 10, position: 'relative', top: 0, left: 0, fontSize: 28 }]}>
                      {typeof recipe?.averageRating === 'number'
                        ? (Number.isInteger(recipe?.averageRating)
                          ? recipe?.averageRating
                          : recipe?.averageRating.toFixed(1))
                        : '-'}
                    </Text>
                    <View style={{ justifyContent: 'center' }}>
                      <StarRating rating={Math.round(recipe?.averageRating || 0)} />
                      <Text style={[styles.reviews]}>({recipe?.ratings?.length || 0} reviews)</Text>
                    </View>
                  </ProtectLoggedIn>
                </View>

                <CalculoIng usedIngredients={recipe?.usedIngredients || []} people={recipe?.numberOfPeople || 1} servings={recipe?.servings || 1} isMine={isMine} id={recipe?.id}/>

                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Instructions width={30} height={30} />
                    <Text style={[styles.tituloInstrucciones]}>Instrucciones</Text>
                  </View>
                  {(recipe?.steps && recipe?.steps.length > 0) ? (
                    recipe?.steps.map((step, idx) => {
                      const currentIndex = stepImageIndexes[step.id] || 0;
                      return (
                        <View key={step.id} style={styles.pasoContainer}>
                          {/* Step row */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text
                              style={[styles.pasoTexto, {width: (isMine ? '90%' : '100%')}]}
                            >
                              {`${step.stepNumber || ''}. ${step.text || 'Sin texto'}`}
                            </Text>
                          </View>

                          {(step.multimedia && step.multimedia.length > 0) && (
                            <ScrollView
                              horizontal
                              pagingEnabled
                              decelerationRate="fast"
                              snapToAlignment="center"
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={styles.imagenesScroll1}
                              style={styles.imagenesScroll}
                              onScroll={e => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / (windowWidth - 50));
                                if (stepImageIndexes[step.id] !== index) {
                                  setStepImageIndexes(prev => ({ ...prev, [step.id]: index }));
                                }
                              }}
                              scrollEventThrottle={16}
                            >
                              {step.multimedia.map((url, index) => (
                                <View key={index} style={{ position: 'relative' }}>
                                  <Image
                                    source={{ uri: url.contentUrl }}
                                    style={styles.pasoImagen}
                                    resizeMode="cover"
                                  />
                                </View>
                              ))}
                            </ScrollView>
                          )}

                          {(step.multimedia && step.multimedia.length > 1) && (
                            <View style={[styles.dotsOverlayContainer, {bottom: 5}]}>
                              {step.multimedia.map((_, idx) => (
                                <View
                                  key={idx}
                                  style={[
                                    styles.dot,
                                    currentIndex === idx ? styles.dotActive : null
                                  ]}
                                />
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{ color: colors.mutedText, marginBottom: 8}}>No hay pasos disponibles</Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <ProtectLoggedIn>
                    <PrimaryButton
                        title="Ver reseñas"
                        style={styles.button}
                        onPress={() => {}}
                    />
                  </ProtectLoggedIn>
                </View>
            </Animated.View>
        </Animated.ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imagenComida: {
    width: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  espacio: {
    height: 250,
    backgroundColor: 'transparent',
  },
  fondoBlanco: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 25,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  titulo: {
    fontSize: 30,
    color: colors.clickableText,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 20,
    color: colors.mutedText,
    fontWeight: "bold",
  },
  subtitulo2: {
    fontSize: 20,
    letterSpacing: 0.6,
    fontWeight: "500",
    fontFamily: "Roboto Flex",
    color: colors.clickableText,
    textAlign: "justify",
    width: 223,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryBackground,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.clickableText,
  },
  userNick: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  descripcinParent: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.clickableText,
    marginVertical: 8,
  },
  recipeDescription: {
    fontSize: 17,
    color: colors.mutedText,
    textAlign: "justify",
    marginBottom: 16,
  },
  //Los dos rectangulos: Tiempo de coccion y Reviews
  groupParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch', // ensures children stretch to same height
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  rectangleBox: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.mediumBorder,
    paddingHorizontal: 12,
    minHeight: 61, // Ensures a minimum height for both
  },
  min: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    flexShrink: 1,
  },
  tiempoDeCoccion: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.clickableText,
    flexShrink: 1,
  },
  text: {
    position: "absolute",
    top: 15,
    left: 5,
    fontSize: 30,
    fontWeight: "500",
    color: colors.clickableText,
    fontFamily: "Roboto Flex",
    textAlign: "center",
  },
  reviews: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.primary,
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
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tituloInstrucciones: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 16,
  },
  pasoContainer: {
    marginBottom: 10,
  },
  pasoTexto: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: colors.clickableText,
    textAlign: 'justify',
    marginBottom: 8,
  },
  imagenesScroll: {
    maxHeight: 220,
    width: '100%',
  },
  imagenesScroll1: {
    flexDirection: 'row',
  },
  pasoImagen: {
    width: windowWidth - 50, // 50 for padding/margin, adjust as needed
    height: 200,
    borderRadius: 12,
    marginRight: 0,
    marginHorizontal: 0,
    alignSelf: 'center',
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
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryText,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotsOverlayContainer: {
    position: 'absolute',
    bottom: 40, // Move to the bottom of the image
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  menuButtonCarousel: {
    position: 'absolute',
    right: 16,
    bottom: 40, // above the dots
    zIndex: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonCarousel: {
    position: 'absolute',
    left: 16,
    bottom: 40, // above the dots
    zIndex: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigLeftButton: {
    position: 'absolute',
    left: 16,
    bottom: 40,
    zIndex: 20,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 5,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigRightButton: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    zIndex: 20,
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 5,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStepBox: {
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  addStepText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});
