import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsModal from '../global/modals/OptionsModal';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import AlertModal from '../global/modals/AlertModal';
import { MaterialIcons } from '@expo/vector-icons';
import {
  deleteRecipe,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  addRecipeToRemindLater,
  removeRecipeFromRemindLater
} from '../../services/recipes';
import { useQueryClient } from '@tanstack/react-query';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function RecipeCard({ recipe, isFavorite = false, isRemindLater = false }) {
  // Fallbacks for missing fields
  const imageUrl = recipe.mainPhoto || recipe.imageUrl;
  const name = recipe.recipeName || recipe.name;
  const time = recipe.cookingTime || recipe.time;
  const author = recipe.user?.nickname || recipe.author || 'Desconocido';
  const recipeType = recipe.recipeType?.description || recipe.recipeType || '';
  const avgRating = recipe.averageRating ?? '-';
  const ratingCount = recipe.ratingCount ?? 0;

  const [isMine, setIsMine] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [remindLater, setRemindLater] = useState(isRemindLater);
  const [favLoading, setFavLoading] = useState(false);
  const [remindLoading, setRemindLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDeleteRating, setShowDeleteRating] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  useEffect(() => {
    const checkOwner = async () => {
      const myId = await AsyncStorage.getItem('user_id');
      if (myId && recipe.user?.id && myId === recipe.user.id.toString()) {
        setIsMine(true);
      } else {
        setIsMine(false);
      }
    };
    checkOwner();
  }, [recipe.user?.id]);

  // Update favorite/remindLater state if props change (for Bookmarks page)
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);
  useEffect(() => {
    setRemindLater(isRemindLater);
  }, [isRemindLater]);

  const handleToggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (favorite) {
        await removeRecipeFromFavorites(recipe.id);
        setFavorite(false);
      } else {
        await addRecipeToFavorites(recipe.id);
        setFavorite(true);
      }
      queryClient.invalidateQueries(['whoAmI']);
    } catch (e) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo actualizar favoritos.' });
    }
    setFavLoading(false);
  };

  const handleToggleRemindLater = async () => {
    if (remindLoading) return;
    setRemindLoading(true);
    try {
      if (remindLater) {
        await removeRecipeFromRemindLater(recipe.id);
        setRemindLater(false);
      } else {
        await addRecipeToRemindLater(recipe.id);
        setRemindLater(true);
      }
      queryClient.invalidateQueries(['whoAmI']);
    } catch (e) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo actualizar recordatorios.' });
    }
    setRemindLoading(false);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate('EditRecipe', { id: recipe.id });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    setConfirmDelete(true);
  };

  const confirmDeleteRecipe = async () => {
    setConfirmDelete(false);
    try {
      await deleteRecipe(recipe.id);
      // setAlert({ visible: true, title: 'Receta eliminada', message: 'La receta ha sido eliminada.' });
      queryClient.invalidateQueries(['recipes']);
      queryClient.invalidateQueries(['whoAmI']);
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo eliminar la receta.' });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('Recipe', { id: recipe.id })}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: '#eee' }]} />
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{avgRating}</Text>
            <MaterialIcons name="star" size={15} color="#FFA726" style={{ marginRight: 2 }} />
            <Text style={styles.ratingCount}>({ratingCount})</Text>
          </View>
          {/* Favorite and Remind Later icons (top right, only if not mine) */}
          {!isMine && (
            <View style={styles.topRightIcons}>
              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={[styles.iconButton, favorite && styles.iconButtonActive]}
                disabled={favLoading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {favLoading ? (
                  <ActivityIndicator size={22} color={colors.primary} />
                ) : (
                  <MaterialIcons
                    name={favorite ? 'favorite' : 'favorite-border'}
                    size={24}
                    color={favorite ? colors.primary : colors.secondaryText}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleRemindLater}
                style={[styles.iconButton, remindLater && styles.iconButtonActive]}
                disabled={remindLoading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {remindLoading ? (
                  <ActivityIndicator size={22} color={colors.primary} />
                ) : (
                  <MaterialIcons
                    name={remindLater ? 'schedule' : 'schedule'}
                    size={24}
                    color={remindLater ? colors.primary : colors.secondaryText}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {isMine && (
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
              <MaterialIcons name="more-vert" size={24} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.infoBox, { marginTop: -24, alignSelf: 'stretch' }]}> 
          <Text style={styles.title} numberOfLines={1}>{name}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {time ? (
              <>
                <MaterialIcons name="schedule" size={14} color="#888" /> {time}'
              </>
            ) : null}
            {time && author ? ' · ' : ''}
            {author}
            {(time || author) && recipeType ? ' · ' : ''}
            {recipeType}
          </Text>
        </View>
        <OptionsModal
          visible={menuVisible}
          options={[
            { label: 'Editar Receta', onPress: handleEdit },
            { label: 'Eliminar Receta', onPress: handleDelete, textStyle: { color: colors.danger } },
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
        <AlertModal
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 2,
  },
  meta: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  topRightIcons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
    zIndex: 11,
  },
  iconButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 4,
    marginLeft: 2,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonActive: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
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
