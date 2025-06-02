import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TAB_NAMES = ['Mis Recetas', 'Mis Reseñas', 'Recetas Guardadas'];

export default function ProfileTabs({ myRecipes, myReviews, savedRecipes }) {
  const [selectedTab, setSelectedTab] = useState(0);

  let content = null;
  if (selectedTab === 0) {
    content = myRecipes && myRecipes.length > 0 ? (
      myRecipes.map((recipe, idx) => (
        <Text key={idx} style={styles.item}>{recipe.name}</Text>
      ))
    ) : (
      <Text style={styles.empty}>No tienes recetas.</Text>
    );
  } else if (selectedTab === 1) {
    content = myReviews && myReviews.length > 0 ? (
      myReviews.map((review, idx) => (
        <Text key={idx} style={styles.item}>{review.title || review.comment || 'Sin título'}</Text>
      ))
    ) : (
      <Text style={styles.empty}>No tienes reseñas.</Text>
    );
  } else if (selectedTab === 2) {
    content = savedRecipes && savedRecipes.length > 0 ? (
      savedRecipes.map((recipe, idx) => (
        <Text key={idx} style={styles.item}>{recipe.name}</Text>
      ))
    ) : (
      <Text style={styles.empty}>No tienes recetas guardadas.</Text>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TAB_NAMES.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === idx && styles.selectedTab]}
            onPress={() => setSelectedTab(idx)}
          >
            <Text style={[styles.tabText, selectedTab === idx && styles.selectedTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 24 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f2f2f2' },
  selectedTab: { backgroundColor: '#FFA726' },
  tabText: { color: '#888', fontWeight: 'bold' },
  selectedTabText: { color: '#fff' },
  content: { minHeight: 80, alignItems: 'center' },
  item: { fontSize: 16, marginVertical: 4 },
  empty: { color: '#aaa', fontStyle: 'italic', marginTop: 16 },
});
