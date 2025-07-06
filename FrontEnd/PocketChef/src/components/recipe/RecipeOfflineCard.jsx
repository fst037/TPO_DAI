import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import AlertModal from '../global/modals/AlertModal';
import { MaterialIcons } from '@expo/vector-icons';
import { removeDownloadedRecipe } from '../../services/downloads';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

export default function RecipeOfflineCard({ recipe, onDeleted }) {
  // Fallbacks for missing fields
  const imageUrl = recipe.mainPhoto || recipe.imageUrl;
  const name = recipe.recipeName || recipe.name;
  const time = recipe.cookingTime || recipe.time;
  const author = recipe.user?.nickname || recipe.author || 'Desconocido';
  const recipeType = recipe.recipeType?.description || recipe.recipeType || '';
  const avgRating = recipe.averageRating ?? '-';
  const ratingCount = recipe.ratingCount ?? 0;

  const navigation = useNavigation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [deleting, setDeleting] = useState(false);

  // Delete from downloads
  const handleDeleteFromDownloads = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteRecipe = async () => {
    setDeleting(true);
    try {
      await removeDownloadedRecipe(recipe.id);
      onDeleted(recipe.id);
      setConfirmDelete(false);
    } catch (error) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo eliminar la receta descargada.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('RecipeOffline', { id: recipe.id })}
      activeOpacity={0.7}
    >
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
          
          {/* Delete from downloads icon (top right) */}
          <TouchableOpacity
            onPress={handleDeleteFromDownloads}
            style={styles.deleteButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={deleting}
          >
            <MaterialIcons name="delete" size={24} color={colors.danger} />
          </TouchableOpacity>
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

        <ConfirmationModal
          visible={confirmDelete}
          title="¿Eliminar receta descargada?"
          message="¿Seguro que quieres eliminar esta receta de tus descargas?"
          onConfirm={confirmDeleteRecipe}
          onCancel={() => setConfirmDelete(false)}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          confirmColor={colors.danger}
          cancelColor={colors.secondaryBackground}
          onRequestClose={() => setConfirmDelete(false)}
          loading={deleting}
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
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 11,
  },
});
