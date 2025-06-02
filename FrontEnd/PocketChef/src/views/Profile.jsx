import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { whoAmI } from '../services/users';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileTabs from '../components/ProfileTabs';

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
  const profileImage = user?.profilePictureUrl || require('../../assets/chefcito.png');

  // whoAmI endpoint: user info, myRecipes, myReviews, savedRecipes
  const myRecipes = user?.myRecipes || [];
  const myReviews = user?.myReviews || [];
  const savedRecipes = user?.savedRecipes || [];

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top 20%: Gradient + Profile */}
      <View style={{ flex: 2, backgroundColor: 'transparent' }}>
        <LinearGradient
          colors={['#FFA726', '#fff']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          <View style={{ alignItems: 'center', marginBottom: -48 }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
              <Image source={profileImage} style={{ width: 88, height: 88, borderRadius: 44 }} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>{user?.name || 'Nombre'}</Text>
            <Text style={{ fontSize: 16, color: '#FFA726', fontWeight: 'bold' }}>@{user?.alias || 'alias'}</Text>
            <Text style={{ fontSize: 14, color: '#888' }}>{user?.email || 'email'}</Text>
          </View>
        </LinearGradient>
      </View>
      {/* Bottom 80%: White background */}
      <View style={{ flex: 8, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingTop: 56, alignItems: 'center', paddingHorizontal: 24 }}>
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
          <Button title="Editar Perfil" color="#FFA726" onPress={() => {}} />
        </View>
        {/* Tabs */}
        <ProfileTabs myRecipes={myRecipes} myReviews={myReviews} savedRecipes={savedRecipes} />
        {/* Error/Loading */}
        {error || queryError ? <Text style={{ color: 'red', marginTop: 16 }}>{error || queryError?.message}</Text> : null}
        {isLoading && !error ? <Text style={{ marginTop: 16 }}>Cargando...</Text> : null}
        {/* Logout */}
        <View style={{ marginTop: 32 }}>
          <Button title="Cerrar sesión" onPress={handleLogout} color="#888" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
