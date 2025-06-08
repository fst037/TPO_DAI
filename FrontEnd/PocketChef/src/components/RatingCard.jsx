import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from './ConfirmationModal';
import AlertModal from './AlertModal';
import { removeRatingFromRecipe } from '../services/recipes';
import { useQueryClient } from '@tanstack/react-query';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function renderStars(rating) {
  const fullStars = Math.round(rating);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

export default function RatingCard({ rating, showDeleteButton = true }) {
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
      {/* Trash bin icon top right - solo se muestra si showDeleteButton es true */}
      {showDeleteButton && (
        <TouchableOpacity style={styles.trashButton} onPress={() => setShowDelete(true)}>
          <MaterialIcons name="delete" size={22} color="#d32f2f" />
        </TouchableOpacity>
      )}
      
      <Text style={styles.recipeName}>{recipeName}</Text>
      <View style={styles.userRow}>
        {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userNick}>{email}</Text>
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
        confirmColor="#d32f2f"
        cancelColor="#888"
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
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 2,
    position: 'relative', // for absolute trashButton
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#eee',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userNick: {
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    color: '#FFA726',
    fontSize: 16,
    marginRight: 4,
  },
  score: {
    fontSize: 13,
    color: '#FFA726',
    fontWeight: 'bold',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginLeft: 'auto',
  },
  trashButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});