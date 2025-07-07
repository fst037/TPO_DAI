
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import ProfileTabs from '../components/profile/ProfileTabs';
import PageTitle from '../components/global/PageTitle';
import RecipeCard from '../components/recipe/RecipeCard';
import colors from '../theme/colors';
import { whoAmI } from '../services/users';
import { getDownloadedRecipes } from '../services/downloads';
import RecipeOfflineCard from '../components/recipe/RecipeOfflineCard';

export default function BookMarks({ navigation }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [remindLaterRecipes, setRemindLaterRecipes] = useState([]);
  const [offlineRecipes, setOfflineRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Favoritos, 1: Para después, 2: Offline

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await whoAmI();
        const user = res.data || {};
        setFavoriteRecipes(user.favoriteRecipes || []);
        setRemindLaterRecipes(user.remindLaterRecipes || []);
      } catch (e) {
        setFavoriteRecipes([]);
        setRemindLaterRecipes([]);
      }
      try {
        const offline = await getDownloadedRecipes();
        setOfflineRecipes(offline);
      } catch {
        setOfflineRecipes([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const favoriteIds = new Set(favoriteRecipes.map(r => r.id));
  const remindLaterIds = new Set(remindLaterRecipes.map(r => r.id));

  // Refresh offline recipes after delete
  const handleOfflineDeleted = async () => {
    const offline = await getDownloadedRecipes();
    setOfflineRecipes(offline);
  };

  const renderRecipeList = (recipes, type = 'online') => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />;
    }
    if (!recipes || recipes.length === 0) {
      return <Text style={styles.emptyText}>No se encontraron recetas.</Text>;
    }
    return (
      <ScrollView contentContainerStyle={styles.list}>
        {recipes.map(recipe => (
          type === 'offline' ? (
            <View key={recipe.id} style={{ marginBottom: 8 }}>
              <RecipeOfflineCard recipe={recipe} onDeleted={handleOfflineDeleted} />
            </View>
          ) : (
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
          )
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <PageTitle style={{ marginTop: 48, marginBottom: 16 }}>Marcadores</PageTitle>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.tabButtonActive]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 0 && styles.tabButtonTextActive]}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.tabButtonActive]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 1 && styles.tabButtonTextActive]}>Para después</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 2 && styles.tabButtonActive]}
          onPress={() => setSelectedTab(2)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 2 && styles.tabButtonTextActive]}>Descargadas</Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 0
        ? renderRecipeList(favoriteRecipes)
        : selectedTab === 1
        ? renderRecipeList(remindLaterRecipes)
        : renderRecipeList(offlineRecipes, 'offline')}
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
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonText: {
    color: colors.mutedText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabButtonTextActive: {
    color: colors.background,
  },
});

