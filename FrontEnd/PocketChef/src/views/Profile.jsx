import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { whoAmI } from '../services/users';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileTabs from '../components/ProfileTabs';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import RecipeList from '../components/RecipeList';
import RatingList from '../components/RatingList';

export default function Profile({ navigation }) {
  const [error, setError] = useState('');
  const { data: user, error: queryError, isLoading } = useQuery({
    queryKey: ['whoAmI'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        throw new Error('No autenticado');
      }
      return whoAmI().then(res => res.data);
    },
    retry: false,
    onError: async (err) => {
      setError(err.response?.data?.message || err.message || 'No autenticado');
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    },
  });

  // Dummy fallback for image
  const profileImage = user?.avatar || require('../../assets/chefcito.png');

  // whoAmI endpoint: user info, myRecipes, myReviews, savedRecipes
  const myRecipes = user?.recipes || [];
  const myReviews = user?.ratings || [];
  const savedRecipes = user?.favoriteRecipes || [];
  const remindLaterRecipes = user?.remindLaterRecipes || [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top 20%: Gradient + Profile */}
      <View style={{ flex: 3, backgroundColor: 'transparent' }}>
        <LinearGradient
          colors={['#FFA726', '#fff']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
              <Image source={profileImage} style={{ width: 100, height: 100, borderRadius: 50 }} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>{user?.name || 'Nombre'}</Text>
            <Text style={{ fontSize: 16, color: '#444', fontWeight: 'bold' }}>@{user?.nickname || 'alias'}</Text>
            <Text style={{ fontSize: 14, color: '#444' }}>{user?.email || 'email'}</Text>
          </View>
        </LinearGradient>
      </View>
      {/* Bottom 80%: White background */}
      <View style={{ flex: 7, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingTop: 18, alignItems: 'center', paddingHorizontal: 24 }}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFA726' }}>{myRecipes.length}</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>Recetas</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFA726' }}>{myReviews.length}</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>Reseñas</Text>
          </View>
        </View>
        {/* Edit Profile Button */}
        <View style={{ width: '100%', marginBottom: 16 }}>
          <PrimaryButton title="Editar Perfil" onPress={() => {}} />
        </View>
        {/* Tabs */}
        <ProfileTabs
          tabNames={['Mis Recetas', 'Mis Reseñas', 'Recetas Favoritas', 'Recetas Pendientes']}
        >
          {/* Mis Recetas */}
          <RecipeList recipes={myRecipes} />
          {/* Mis Reseñas */}
          <RatingList ratings={myReviews} />
          {/* Recetas Favoritas */}
          <RecipeList recipes={savedRecipes} />
          {/* Recetas Pendientes */}
          <RecipeList recipes={remindLaterRecipes} />
        </ProfileTabs>
        {/* Error/Loading */}
        {error || queryError ? <Text style={{ color: 'red', marginTop: 16 }}>{error || queryError?.message}</Text> : null}
        {isLoading && !error ? <Text style={{ marginTop: 16 }}>Cargando...</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
