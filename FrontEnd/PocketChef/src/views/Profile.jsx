import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { whoAmI } from '../services/users';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileTabs from '../components/profile/ProfileTabs';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import RecipeList from '../components/recipe/RecipeList';
import RatingList from '../components/rating/RatingList';
import MainLayout from '../components/global/MainLayout';
import { isTokenExpired } from '../utils/jwt';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';

export default function Profile({ navigation }) {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(4); // User tab index
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { data: user, error: queryError, isLoading } = useQuery({
    queryKey: ['whoAmI'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
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

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await AsyncStorage.removeItem('token');
    navigation.replace('Home');
  };

  // Dummy fallback for image
  const profileImage = user?.avatar || require('../../assets/chefcito.png');

  // whoAmI endpoint: user info, myRecipes, myReviews, savedRecipes
  const myRecipes = user?.recipes || [];
  const myReviews = user?.ratings || [];
  const savedRecipes = user?.favoriteRecipes || [];
  const remindLaterRecipes = user?.remindLaterRecipes || [];

  return (
    <MainLayout activeTab={activeTab} onTabPress={setActiveTab}>
      <View style={{ position: 'absolute', top: 60, right: 24, zIndex: 10 }}>
        <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons name="logout" size={28} color="#ED802A" />
        </TouchableOpacity>
      </View>
      <ConfirmationModal
        visible={showLogoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps="handled">
        <View style={{ minHeight: Dimensions.get('window').height}}>
          {/* Top 20%: Gradient + Profile */}
          <View style={{ backgroundColor: 'transparent' }}>
            <LinearGradient
              colors={['#FFA726', '#fff']}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ alignItems: 'center', paddingTop: 56, paddingBottom: 40 }}>
                <Image
                  source={user?.avatar ? { uri: user?.avatar } : require('../../assets/chefcito.png')}
                  style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' }}
                />       
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>{user?.name || 'Nombre'}</Text>
                <Text style={{ fontSize: 16, color: '#444', fontWeight: 'bold' }}>@{user?.nickname || 'alias'}</Text>
                <Text style={{ fontSize: 14, color: '#444' }}>{user?.email || 'email'}</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingTop: 18, alignItems: 'center', paddingHorizontal: 24 }}>
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
            <View style={{ width: '100%', marginBottom: 8 }}>
              <PrimaryButton title="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
            </View>
            {/* Tabs */}
            <ProfileTabs
              tabs={[
                { title: 'Mis Recetas', content: <RecipeList recipes={myRecipes} /> },
                { title: 'Mis Reseñas', content: <RatingList ratings={myReviews} /> },
                { title: 'Recetas Favoritas', content: <RecipeList recipes={savedRecipes} /> },
                { title: 'Recetas Pendientes', content: <RecipeList recipes={remindLaterRecipes} /> },
              ]}
            />
            {/* Error/Loading */}
            {error || queryError ? <Text style={{ color: 'red', marginTop: 16 }}>{error || queryError?.message}</Text> : null}
            {isLoading && !error ? <Text style={{ marginTop: 16 }}>Cargando...</Text> : null}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
