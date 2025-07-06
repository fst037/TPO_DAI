import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getFilteredRecipes } from '../services/recipes';
import { whoAmI } from '../services/users';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import RecipeSearchBar from '../components/recipe/RecipeSearchBar';
import RecipeCard from '../components/recipe/RecipeCard';
import { FontFamily } from '../GlobalStyles';

export default function Recipes({ navigation }) {
  const route = useRoute();
  const initialFilters = route.params?.initialFilters || {};
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [remindLaterIds, setRemindLaterIds] = useState(new Set());

  // Fetch filtered recipes from backend
  const fetchFiltered = async (filterObj) => {
    setLoading(true);
    try {
      const filterParams = {
        ...filterObj
      };
      // Clean up empty arrays/fields
      Object.keys(filterParams).forEach(k => {
        if (Array.isArray(filterParams[k]) && filterParams[k].length === 0) delete filterParams[k];
        if (filterParams[k] === '' || filterParams[k] == null) delete filterParams[k];
      });

      console.log('Fetching recipes with filters:', filterParams);     

      const res = await getFilteredRecipes(filterParams);      
      setRecipes(res.data || []);

    } catch (err) {
      if (err.response) {
        console.log('Error response:', err.response.data, 'Status:', err.response.status, 'Headers:', err.response.headers);
      } else if (err.request) {
        console.log('No response received:', err.request);
      } else {
        console.log('Error setting up request:', err.message);
      }
      
      setRecipes([]);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const res = await whoAmI();
        const user = res.data || {};
        setFavoriteIds(new Set((user.favoriteRecipes || []).map(r => r.id)));
        setRemindLaterIds(new Set((user.remindLaterRecipes || []).map(r => r.id)));
      } catch (e) {
        setFavoriteIds(new Set());
        setRemindLaterIds(new Set());
      }
    };
    fetchUserLists();
    if (initialFilters) {
      fetchFiltered(initialFilters);
    } else {
      fetchFiltered({});
    }
  }, []);

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Recetas</PageTitle>
      <RecipeSearchBar
        initialFilters={initialFilters}
        onSearch={fetchFiltered}
      />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {recipes.length === 0 ? (
            <Text style={styles.emptyText}>No se encontraron recetas.</Text>
          ) : (
            recipes.map(recipe => (
              <Pressable
                key={recipe.id}
                style={{ marginBottom: 8 }}
                onPress={() => navigation.navigate('Recipe', { id: recipe.id })}
              >
                <RecipeCard
                  recipe={recipe}
                  isFavorite={favoriteIds.has(recipe.id)}
                  isRemindLater={remindLaterIds.has(recipe.id)}
                />
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  list: {
    paddingBottom: 32,
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 48,
  },
});
