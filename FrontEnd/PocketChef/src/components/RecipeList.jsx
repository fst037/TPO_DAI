import React from 'react';
import { View, Text } from 'react-native';
import RecipeCard from './RecipeCard';

export default function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return (
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#aaa', fontStyle: 'italic' }}>No hay recetas.</Text>
      </View>
    );
  }
  return (
    <View style={{ gap: 12, paddingBottom: 8 }}>
      {recipes.map(item => (
        <RecipeCard key={item.id?.toString() || item.name} recipe={item} />
      ))}
    </View>
  );
}
