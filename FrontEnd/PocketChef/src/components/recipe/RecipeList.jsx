import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RecipeCard from './RecipeCard';
import colors from '../../theme/colors';

export default function RecipeList({ recipes }) {
  // Get unique recipe types from recipes
  const recipeTypes = useMemo(() => {
    if (!recipes || recipes.length === 0) return [];
    const types = Array.from(new Set(recipes.map(r => r.recipeType?.description).filter(Boolean)));
    return ['all', ...types];
  }, [recipes]);

  const [filter, setFilter] = useState('all');

  const filteredRecipes =
    filter === 'all'
      ? recipes
      : recipes?.filter(r => r.recipeType?.description === filter);

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {recipeTypes.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type)}
            style={{
              backgroundColor: filter === type ? colors.secondary : colors.secondaryBackground,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderWidth: filter === type ? 1.5 : 1,
              borderColor: filter === type ? colors.secondary : colors.mediumBorder,
              marginHorizontal: 2,
              minWidth: 38,
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={{ color: filter === type ? colors.primaryText : colors.secondaryText, fontWeight: 'bold', textTransform: 'capitalize' }}>
              {type === 'all' ? 'Todas' : type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {(!filteredRecipes || filteredRecipes.length === 0) ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.secondaryText, fontStyle: 'italic' }}>No hay recetas.</Text>
        </View>
      ) : (
        <View style={{ gap: 12, paddingBottom: 8 }}>
          {filteredRecipes.map(item => (
            <RecipeCard key={item.id?.toString() || item.name} recipe={item} />
          ))}
        </View>
      )}
    </View>
  );
}
