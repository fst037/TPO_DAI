import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from '../global/modals/ConfirmationModal';
import AlertModal from '../global/modals/AlertModal';
import { removeRatingFromRecipe } from '../../services/recipes';
import { useQueryClient } from '@tanstack/react-query';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

export default function RatingCard({ rating }) {
  const navigation = useNavigation();
  const [showDelete, setShowDelete] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const queryClient = useQueryClient();
  const recipeName = rating.recipe?.recipeName || rating.recipe?.name || 'Receta';
  const user = rating.user || {};
  const avatar = user.avatar;
  const name = user.nickname || user.name || 'Usuario';
  const email = user.email || '';
  const comments = rating.comments || rating.comment || '';
  const score = rating.rating ?? rating.score ?? '-';
  const date = rating.createdAt ? formatDate(rating.createdAt) : '';

  const handleDeleteRating = async () => {
    setShowDelete(false);
    try {
      await removeRatingFromRecipe(rating.recipe?.id, rating.id);
      // setAlert({ visible: true, title: 'Calificación eliminada', message: 'La calificación ha sido eliminada.' });
      queryClient.invalidateQueries(['ratings']);
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: 'No se pudo eliminar la calificación.' });
    }
  };

  return (
    <View style={styles.card}>
      {/* Trash bin icon top right */}
      <TouchableOpacity style={styles.trashButton} onPress={() => setShowDelete(true)}>
        <MaterialIcons name="delete" size={22} color={colors.danger} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => rating.recipe?.id && navigation.navigate('Recipe', { id: rating.recipe.id })}>
        <Text style={styles.recipeName}>{recipeName}</Text>
      </TouchableOpacity>
      <View style={styles.userRow}>
        {avatar && (
          <TouchableOpacity onPress={() => user.id && navigation.navigate('Profile', { userId: user.id })}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </TouchableOpacity>
        )}
        <View style={{ marginLeft: 10 }}>
          <TouchableOpacity onPress={() => user.id && navigation.navigate('Profile', { userId: user.id })}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userNick}>{email}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {comments ? <Text style={styles.comment}>{comments}</Text> : null}
      <View style={styles.ratingRow}>
        <Text style={styles.stars}>{renderStars(score)}</Text>
        <Text style={styles.score}>{score}/5</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <ConfirmationModal
        visible={showDelete}
        title="¿Eliminar calificación?"
        message="¿Seguro que quieres eliminar esta calificación?"
        onConfirm={handleDeleteRating}
        onCancel={() => setShowDelete(false)}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmColor={colors.danger}
        cancelColor={colors.secondaryBackground}
        onRequestClose={() => setShowDelete(false)}
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
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 2,
    position: 'relative', // for absolute trashButton
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.clickableText,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryBackground,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.clickableText,
  },
  userNick: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  comment: {
    fontSize: 13,
    color: colors.clickableText,
    marginTop: 4,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    color: colors.secondary,
    fontSize: 16,
    marginRight: 4,
  },
  score: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: colors.secondaryText,
    marginLeft: 'auto',
  },
  trashButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
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
});
