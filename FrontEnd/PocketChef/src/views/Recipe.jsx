import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Animated, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import CalculoIng from '../components/CalculoIng';
import BotonCircularBlanco from '../components/BotonCircularBlanco';
import heartBlack from '../../assets/heartBlack.svg';
import Hour from '../../assets/Hour.svg';
import StarPintada from '../../assets/StarPintada.svg';
import StarNoPintada from '../../assets/StarNoPintada.svg';
import Instructions from '../../assets/Instructions';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addPhotoToRecipe, getRecipeById, removePhotoFromRecipe, updateRecipe, deleteRecipe, removeStepFromRecipe, removeMultimediaFromStep, addRecipeToFavorites, removeRecipeFromFavorites, addRecipeToRemindLater, removeRecipeFromRemindLater } from '../services/recipes';
import { downloadRecipe, getDownloadedRecipeById } from '../services/downloads';
import colors from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsModal from '../components/global/modals/OptionsModal';
import { MaterialIcons } from '@expo/vector-icons';
import AlertModal from '../components/global/modals/AlertModal';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import EditStep from './EditStep';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import ProtectLoggedIn from '../components/global/ProtectLoggedIn';

const windowWidth = Dimensions.get('window').width;

export default function Recipe(props) {
    // All hooks at the top level, before any logic or returns
    const scrollY = useRef(new Animated.Value(0)).current;
    const [photo, setPhoto] = useState("");
    const [imageAspectRatios, setImageAspectRatios] = useState({});
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [stepImageIndexes, setStepImageIndexes] = useState({});
    const [isMine, setIsMine] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
    const [confirmDelete, setConfirmDelete] = useState(false);
    // Favorite/remind-later state for this recipe
    const [favorite, setFavorite] = useState(false);
    const [remindLater, setRemindLater] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [remindLoading, setRemindLoading] = useState(false);
    // Download state
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleToggleFavorite = async () => {
      if (favLoading) return;
      setFavLoading(true);
      try {
        if (favorite) {
          await removeRecipeFromFavorites(receta?.data.id);
          setFavorite(false);
        } else {
          await addRecipeToFavorites(receta?.data.id);
          setFavorite(true);
        }
      } catch (e) {
        console.log(e.response?.data);
        setAlert({ visible: true, title: 'Error', message: 'No se pudo actualizar favoritos.' });
      }
      setFavLoading(false);
    };

    const handleToggleRemindLater = async () => {
      if (remindLoading) return;
      setRemindLoading(true);
      try {
        if (remindLater) {
          await removeRecipeFromRemindLater(receta?.data.id);
          setRemindLater(false);
        } else {
          await addRecipeToRemindLater(receta?.data.id);
          setRemindLater(true);
        }
      } catch (e) {
        console.log(e.response?.data);
        setAlert({ visible: true, title: 'Error', message: 'No se pudo actualizar recordatorios.' });
      }
      setRemindLoading(false);
    };

    // Download handler
    const handleDownloadRecipe = async () => {
      if (!recipe) return;
      setDownloading(true);
      try {
        await downloadRecipe(recipe);
        setDownloaded(true);
        setAlert({ visible: true, title: 'Descargada', message: 'La receta está disponible offline.' });
      } catch (e) {
        console.error('Error downloading recipe:', e);
        setAlert({ visible: true, title: 'Error', message: 'No se pudo descargar la receta.' });
      }
      setDownloading(false);
    };
    const [stepMenuVisible, setStepMenuVisible] = useState({}); // { [stepId]: boolean }
    const [stepToEdit, setStepToEdit] = useState(null);
    const [stepToDelete, setStepToDelete] = useState(null);
    const [confirmDeleteMultimedia, setConfirmDeleteMultimedia] = useState({ visible: false, stepId: null, multimediaId: null });
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    // Prefer prop, fallback to route.params
    const id = props.id ?? route.params?.id;

    const { data: receta, isLoading, error, refetch, isFetching } = useQuery({
      queryKey: ['recipe', id],
      queryFn: () => getRecipeById(id),
      enabled: !!id,
      onSuccess: (data) => {
        if (data.photos?.length > 0) {
          setPhoto(data.photos[0].photoUrl);
        }
      }
    });

    // Refetch recipe when screen is focused
    useFocusEffect(
      React.useCallback(() => {
      if (id) {
        refetch();
      }
      }, [id, refetch])
    );
    
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

    const recipe = receta?.data;

    // Combine mainPhoto and recipe.photos for the main slider, memoized for stability
    const mainImages = useMemo(() => {
      let imgs = [];
      if (receta?.data?.mainPhoto) imgs.push({ url: receta.data.mainPhoto });
      if (receta?.data?.photos && Array.isArray(receta.data.photos)) {
        receta.data.photos.forEach(photo => {
          if (!imgs.some(img => img.url === photo.photoUrl)) {
            imgs.push({ url: photo.photoUrl });
          }
        });
      }
      return imgs;
    }, [receta]);

    useEffect(() => {
      if (receta) {
        setFavorite(receta?.data?.favorite);
        setRemindLater(receta?.data?.remindLater);
      }
    }, [receta]);

    // Check if recipe is already downloaded
    useEffect(() => {
      const checkDownloaded = async () => {
        if (recipe?.id) {
          const local = await getDownloadedRecipeById(recipe.id);
          setDownloaded(!!local);
        } else {
          setDownloaded(false);
        }
      };
      checkDownloaded();
    }, [recipe?.id, recipe]);

    // Check if the recipe is owned by the user (must be above any return)
    useEffect(() => {
      const checkOwner = async () => {
        const myId = await AsyncStorage.getItem('user_id');
        if (myId && recipe?.user?.id && myId === recipe?.user.id.toString()) {
          setIsMine(true);
        } else {
          setIsMine(false);
        }
      };
      checkOwner();
    }, [recipe?.user?.id]);

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
    }, [receta]);

    // Ensure mainImageIndex is always valid when mainImages changes
    useEffect(() => {
      if (mainImageIndex >= mainImages.length) {
        setMainImageIndex(0);
      }
    }, [mainImages.length]);
    
    // Show loading state on both initial load and refetch
    if (isLoading || isFetching ) {
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

    if (!receta) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Receta no encontrada.</Text>
        </View>
      );
    }

    // Calculate the height of the current main image
    const handleDeletePhoto = async () => {
      if (!receta?.data) return;
      setMenuVisible(false);
      try {
        const current = receta.data;
        const photoToDeleteUrl = mainImages[mainImageIndex].url;
        // Find the photo object in aux photos
        const photoObj = current.photos.find(p => p.photoUrl === photoToDeleteUrl);        
        await removePhotoFromRecipe(current.id, photoObj.id);
        queryClient.invalidateQueries(['recipe', current.id]);
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar la foto.' });
      }
    };

    const handleDeleteRecipe = () => {
      setMenuVisible(false);
      setConfirmDelete(true);
    };

    const confirmDeleteRecipe = async () => {
      setConfirmDelete(false);
      if (!receta?.data) return;
      try {
        await deleteRecipe(receta.data.id);
        setAlert({ visible: true, title: 'Receta eliminada', message: 'La receta ha sido eliminada.' });
        queryClient.invalidateQueries(['recipes']);
        navigation.goBack();
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar la receta.' });
      }
    };

    const openStepMenu = (stepId) => {
      setStepMenuVisible(prev => ({ ...prev, [stepId]: true }));
    };
    const closeStepMenu = (stepId) => {
      setStepMenuVisible(prev => ({ ...prev, [stepId]: false }));
    };

    // Handler for edit/delete actions (implement logic as needed)
    const handleEditStep = (step) => {
      setStepMenuVisible(prev => ({ ...prev, [step.id]: false }));
      navigation.navigate('EditStep', { recipeId: id, stepId: step.id });
    };
    const handleDeleteStep = (step) => {
      setStepToDelete(step);
      // Also close the step menu so the modal is not hidden behind it
      setStepMenuVisible(prev => ({ ...prev, [step.id]: false }));
    };
    const confirmDeleteStep = async () => {
      if (!stepToDelete) return;
      try {
        await removeStepFromRecipe(id, stepToDelete.id);
        setStepToDelete(null);
        queryClient.invalidateQueries(['recipe', id]);
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar el paso.' });
      }
    };

    // Handler for multimedia actions
    const handleAddStepMultimedia = (stepId) => {
      navigation.navigate('AddStepMultimedia', { recipeId: id, stepId });
    };
    const handleDeleteStepMultimedia = (stepId, multimediaId) => {
      setConfirmDeleteMultimedia({ visible: true, stepId, multimediaId });
    };
    const confirmDeleteStepMultimedia = async () => {
      const { stepId, multimediaId } = confirmDeleteMultimedia;
      if (!stepId || !multimediaId) return;
      try {
        await removeMultimediaFromStep(id, stepId, multimediaId);
        queryClient.invalidateQueries(['recipe', id]);
      } catch (err) {
        setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar la multimedia.' });
      } finally {
        setConfirmDeleteMultimedia({ visible: false, stepId: null, multimediaId: null });
      }
    };

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
                {/* Download button (top right) */}
                <TouchableOpacity
                  style={{ position: 'absolute', top: 16, right: 16, zIndex: 30, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 6, elevation: 3 }}
                  onPress={handleDownloadRecipe}
                  disabled={downloading || downloaded}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {downloading ? (
                    <ActivityIndicator size={20} color={colors.primary} />
                  ) : (
                    <MaterialIcons name={downloaded ? 'cloud-done' : 'cloud-download'} size={24} color={downloaded ? colors.primary : colors.secondaryText} />
                  )}
                </TouchableOpacity>
                {/* Favorite/remind-later icons for NOT owner, else show owner controls */}
                {!isMine ? (
                  <>
                    {/* Remind Later button (left) */}
                    <ProtectLoggedIn
                      onPress={handleToggleRemindLater}
                      style={[styles.bigLeftButton, remindLater && { borderColor: colors.primary, borderWidth: 2 }]}
                      disabled={remindLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {remindLoading ? (
                        <ActivityIndicator size={28} color={colors.primary} />
                      ) : (
                        <MaterialIcons
                          name={'schedule'}
                          size={32}
                          color={remindLater ? colors.primary : colors.secondaryText}
                        />
                      )}
                    </ProtectLoggedIn>
                    {/* Favorite button (right) */}
                    <ProtectLoggedIn
                      onPress={handleToggleFavorite}
                      style={[styles.bigRightButton, favorite && { borderColor: colors.primary, borderWidth: 2 }]}
                      disabled={favLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {favLoading ? (
                        <ActivityIndicator size={28} color={colors.primary} />
                      ) : (
                        <MaterialIcons
                          name={favorite ? 'favorite' : 'favorite-border'}
                          size={32}
                          color={favorite ? colors.primary : colors.secondaryText}
                        />
                      )}
                    </ProtectLoggedIn>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.cameraButtonCarousel}
                      onPress={() => navigation.navigate('AddRecipePhoto', { id })}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuButtonCarousel}
                      onPress={() => setMenuVisible(true)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialIcons name="more-vert" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </>
                )}
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
                {/* OptionsModal for image actions */}
                <OptionsModal
                  visible={menuVisible}
                  options={[
                    ...(mainImageIndex > 0 ? [
                      { label: 'Eliminar foto', onPress: handleDeletePhoto, textStyle: { color: colors.danger } },
                    ] : []),
                    { label: 'Editar receta', onPress: () => { setMenuVisible(false); navigation.navigate('EditRecipe', { id, receta }); } },
                    { label: 'Eliminar receta', onPress: handleDeleteRecipe, textStyle: { color: colors.danger } },
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
                  cancelColor={colors.secondaryBackground}
                  onRequestClose={() => setConfirmDelete(false)}
                />
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
                      onPress={async () => {
                        const myId = await AsyncStorage.getItem('user_id');
                        if (recipe?.user?.id && myId && recipe?.user.id.toString() !== myId) {
                          navigation.navigate('Profile', { propUserId: recipe?.user.id });
                        }
                      }}
                    >
                      <Image source={{ uri: recipe?.user?.avatar }} style={styles.avatar} />
                    </TouchableOpacity>
                  ) : null}
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      onPress={async () => {
                        const myId = await AsyncStorage.getItem('user_id');
                        if (recipe?.user?.id && myId && recipe?.user.id.toString() !== myId) {
                          navigation.navigate('Profile', { propUserId: recipe?.user.id });
                        }
                      }}
                    >
                      <Text style={styles.userName}>{recipe?.user?.name}</Text>
                      <Text style={styles.userNick}>{recipe?.user?.email}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.description]}>Descripción</Text>
                <Text style={[styles.recipeDescription]}>{recipe?.recipeDescription || 'Sin descripción'}</Text>

                <View style={styles.groupParent}>

                  <View style={styles.rectangleBox}>
                    <Hour width={24} height={24} style={{ marginRight: 10 }} />
                    <View>
                      <Text style={styles.tiempoDeCoccion}>Tiempo de cocción</Text>
                      <Text style={styles.min}>{recipe?.cookingTime ? `${recipe?.cookingTime} min` : 'Sin tiempo'}</Text>
                    </View>
                  </View>

                  <ProtectLoggedIn onPress={() => navigation.navigate('SeeReviews', { id: recipe?.id })} style={styles.rectangleBox}>
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
                            {isMine && (
                              <TouchableOpacity onPress={() => openStepMenu(step.id)} style={{ borderRadius: 8, alignSelf: 'flex-start' }}>
                                <MaterialIcons name="more-vert" size={22} color={colors.mutedText} />
                              </TouchableOpacity>
                            )}
                          </View>
                          <OptionsModal
                            visible={!!stepMenuVisible[step.id]}
                            options={[
                              { label: 'Editar paso', onPress: () => handleEditStep(step) },
                              { label: 'Eliminar paso', onPress: () => handleDeleteStep(step), textStyle: { color: colors.danger } },
                            ]}
                            onRequestClose={() => closeStepMenu(step.id)}
                          />
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
                                  {isMine && (
                                    <TouchableOpacity
                                      style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 4, zIndex: 10 }}
                                      onPress={() => handleDeleteStepMultimedia(step.id, url.id)}
                                    >
                                      <MaterialIcons name="delete" size={20} color={colors.danger} />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ))}
                            </ScrollView>
                          )}
                          {(step.multimedia && step.multimedia.length > 1) && (
                            <View style={[styles.dotsOverlayContainer, {bottom: 60}]}> 
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
                          {isMine && (
                            <TouchableOpacity
                              style={[styles.addStepBox, { marginTop: 4, marginBottom: 4 }]}
                              onPress={() => handleAddStepMultimedia(step.id)}
                            >
                              <Text style={styles.addStepText}>+ Agregar Multimedia</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{ color: colors.mutedText, marginBottom:8}}>No hay instrucciones disponibles.</Text>
                  )}
                  {isMine && (
                    <TouchableOpacity
                      style={styles.addStepBox}
                      onPress={() => navigation.navigate('CreateStep', { recipeId: id, afterStep: recipe?.steps?.length ? recipe?.steps[recipe?.steps.length - 1].stepNumber : 0 })}
                    >
                      <Text style={styles.addStepText}>+ Agregar paso</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <ProtectLoggedIn>
                    <PrimaryButton
                        title="Ver reseñas"
                        style={styles.button}
                        onPress={() => navigation.navigate('SeeReviews', { id: id })}
                    />
                  </ProtectLoggedIn>
                </View>
            </Animated.View>
        </Animated.ScrollView>
        {stepToDelete && (
          <ConfirmationModal
            visible={!!stepToDelete}
            title="¿Eliminar paso?"
            message="Esta acción no se puede deshacer."
            onConfirm={confirmDeleteStep}
            onCancel={() => setStepToDelete(null)}
            confirmLabel="Eliminar"
            cancelLabel="Cancelar"
            confirmColor={colors.danger}
            cancelColor={colors.secondaryBackground}
            onRequestClose={() => setStepToDelete(null)}
          />
        )}
        <ConfirmationModal
          visible={confirmDeleteMultimedia.visible}
          title="¿Eliminar multimedia?"
          message="Esta acción no se puede deshacer."
          onConfirm={confirmDeleteStepMultimedia}
          onCancel={() => setConfirmDeleteMultimedia({ visible: false, stepId: null, multimediaId: null })}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          confirmColor={colors.danger}
          cancelColor={colors.secondaryBackground}
          onRequestClose={() => setConfirmDeleteMultimedia({ visible: false, stepId: null, multimediaId: null })}
        />
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
});