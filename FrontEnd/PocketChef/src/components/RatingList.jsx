import React from 'react';
import { View, FlatList, Text } from 'react-native';
import RatingCard from './RatingCard';

export default function RatingList({ ratings }) {
  return (
    <FlatList
      data={ratings}
      keyExtractor={item => item.id?.toString() || item.title || item.comment}
      renderItem={({ item }) => <RatingCard rating={item} />}
      contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
      ListEmptyComponent={<View style={{ alignItems: 'center' }}><Text style={{ color: '#aaa', fontStyle: 'italic' }}>No hay reseñas.</Text></View>}
    />
  );
}
