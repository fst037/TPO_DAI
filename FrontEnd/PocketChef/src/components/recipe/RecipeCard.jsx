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

export default function RecipeCard({ recipe, navigation }) {
  // Fallbacks for missing fields
  const imageUrl = recipe.mainPhoto || recipe.imageUrl;
  const name = recipe.recipeName || recipe.name;
  const time = recipe.cookingTime || recipe.time;
  const author = recipe.user?.nickname || recipe.author || 'Desconocido';
  const recipeType = recipe.recipeType?.description || recipe.recipeType || '';
  const avgRating = recipe.averageRating ?? '-';
  const ratingCount = recipe.ratingCount ?? 0;

  const [isMine, setIsMine] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDeleteRating, setShowDeleteRating] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();

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

  const handleEdit = () => {
    setMenuVisible(false);
    // navigation.navigate('EditRecipe', { recipeId: recipe.id });
    // Placeholder: Alert for now
    Alert.alert('Editar Receta', 'Funcionalidad de edición aún no implementada.');
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
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo eliminar la receta.' });
    }
  };

  return (
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
