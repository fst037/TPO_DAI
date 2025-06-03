import React from 'react';
import { View, FlatList, Text } from 'react-native';
import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }) {
  return (
    <FlatList
      data={recipes}
      keyExtractor={item => item.id?.toString() || item.name}
      renderItem={({ item }) => <RecipeCard recipe={item} />}
      contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
      style={{ width: '100%', alignSelf: 'center' }}
      ListEmptyComponent={<View style={{ alignItems: 'center' }}><Text style={{ color: '#aaa', fontStyle: 'italic' }}>No hay recetas.</Text></View>}
    />
  );
}
