import React from 'react';
import { View, Text } from 'react-native';
import RatingCard from './RatingCard';

export default function RatingList({ ratings, showDeleteButton = true }) {
  if (!ratings || ratings.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#aaa', fontStyle: 'italic' }}>No hay reseñas.</Text>
      </View>
    );
  }
  return (
    <View style={{ gap: 12, paddingBottom: 8 }}>
      {ratings.map(item => (
        <RatingCard key={item.id?.toString() || item.title || item.comment} rating={item} showDeleteButton={showDeleteButton}/>
      ))}
    </View>
  );
}
