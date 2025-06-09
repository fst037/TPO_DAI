import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { getFilteredRecipes } from '../services/recipes';
import colors from '../theme/colors';
import PageTitle from '../components/global/PageTitle';
import RecipeSearchBar from '../components/recipe/RecipeSearchBar';
import RecipeCard from '../components/recipe/RecipeCard';
import { FontFamily } from '../GlobalStyles';

export default function Recipes({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  // Fetch filtered recipes from backend
  const fetchFiltered = async (searchText, filterObj) => {
    setLoading(true);
    try {
      const filterParams = {
        ...filterObj,
        search: searchText,
        includedIngredients: filterObj.includedIngredients || [],
        excludedIngredients: filterObj.excludedIngredients || [],
        recipeType: filterObj.recipeType || '',
        sortBy: filterObj.sortBy,
        username: filterObj.username,
      };
      // Clean up empty arrays/fields
      Object.keys(filterParams).forEach(k => {
        if (Array.isArray(filterParams[k]) && filterParams[k].length === 0) delete filterParams[k];
        if (filterParams[k] === '' || filterParams[k] == null) delete filterParams[k];
      });
      const res = await getFilteredRecipes(filterParams);
      console.log('Filtered recipes response:', res.data);
      
      setRecipes(res.data || []);
    } catch (err) {
      setRecipes([]);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchFiltered('', {});
  }, []);

  // When search or filters change, refetch
  useEffect(() => {
    fetchFiltered(search, filters);
  }, [search, filters]);

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Recetas</PageTitle>
      <RecipeSearchBar
        value={search}
        onChangeText={setSearch}
        onFiltersChange={setFilters}
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
                <RecipeCard recipe={recipe} />
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
