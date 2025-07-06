import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { whoAmI, getUserById } from '../services/users';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileTabs from '../components/profile/ProfileTabs';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import RecipeList from '../components/recipe/RecipeList';
import RatingList from '../components/rating/RatingList';
import { isTokenExpired, getUserIdFromToken } from '../utils/jwt';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import colors from '../theme/colors';
import { useRoute } from '@react-navigation/native';

export default function Profile({ navigation }) {
  const route = useRoute();
  const propUserId = route.params?.propUserId || route.params?.userId;
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        navigation.replace('Login');
        return;
      }
      const loggedId = getUserIdFromToken(token);
      if (!propUserId) {
        setUserId(loggedId);
        setIsOwnProfile(true);
      } else {
        setUserId(propUserId);
        setIsOwnProfile(String(propUserId) === String(loggedId));
      }
    };
    checkUser();
  }, [propUserId]);

  // Fetch user data: if userId is provided, fetch that user, else fallback to whoAmI
  const { data: user, error: queryError, isLoading } = useQuery({
    queryKey: !isOwnProfile ? ['user', userId] : ['whoAmI'],
    queryFn: async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        navigation.replace('Login');
        throw new Error('No autenticado');
      }
      if (!isOwnProfile) {
        return getUserById(userId).then(res => res.data);
      } else {
        return whoAmI().then(res => res.data);
      }
    },
    retry: false,
    onError: async (err) => {
      setError(err.response?.data?.message || err.message || 'No autenticado');
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    },
  });

  useEffect(() => {
    const checkStudent = async () => {
      if (user?.studentProfile != null && user?.studentProfile != undefined) {
        setIsStudent(true);
      }
    };
    if (user) {
      checkStudent();  
    }
  }, [user]);

  const userRecipes = user?.recipes || [];
  const userReviews = user?.ratings || [];
  const savedRecipes = user?.favoriteRecipes || [];
  const remindLaterRecipes = user?.remindLaterRecipes || [];

  return (
    <View flex={1} style={{ backgroundColor: colors.background }}>
      {/* Only show options/logout if isOwnProfile */}
      {isOwnProfile && (
        <View style={{ position: 'absolute', top: 60, right: 24, zIndex: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('UserOptions')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={{ backgroundColor: colors.terciary, borderRadius: 20, padding: 6, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="settings" size={22} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {isStudent && (
        <View style={{
          position: 'absolute',
          top: 60,
          left: 24,
          zIndex: 10,
          backgroundColor: colors.terciary,
          borderRadius: 20,
          padding: 6,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 50,
          flexDirection: 'row',
        }}>
          <MaterialIcons name="account-balance-wallet" size={20} color={colors.primary} style={{ marginRight: 4 }} />
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>
            ${user?.studentProfile?.balance?.toFixed(2) ?? '0.00'}
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }} keyboardShouldPersistTaps="handled">
        <View style={{ minHeight: Dimensions.get('window').height}}>
          {/* Top 20%: Gradient + Profile */}
          <View style={{ backgroundColor: 'transparent' }}>
            <LinearGradient
              colors={[colors.secondary, colors.background]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ alignItems: 'center', paddingTop: 56, paddingBottom: 40 }}>
                <Image
                  source={user?.avatar ? { uri: user?.avatar } : require('../../assets/chefcito.png')}
                  style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.secondaryBackground }}
                />       
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 12 }}>{user?.name || 'Nombre'}</Text>
                <Text style={{ fontSize: 16, color: colors.clickableText, fontWeight: 'bold' }}>@{user?.nickname || 'alias'}</Text>
                <Text style={{ fontSize: 14, color: colors.clickableText }}>{user?.email || 'email'}</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingTop: 18, alignItems: 'center', paddingHorizontal: 24 }}>
            {/* Stats */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
              <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.secondary }}>{userRecipes.length}</Text>
                <Text style={{ fontSize: 14, color: colors.mutedText }}>Recetas</Text>
              </View>
              <View style={{ alignItems: 'center', marginHorizontal: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.secondary }}>{userReviews.length}</Text>
                <Text style={{ fontSize: 14, color: colors.mutedText }}>Reseñas</Text>
              </View>
            </View>
            {/* Edit Profile Button (only if own profile) */}
            {isOwnProfile && (
              <View style={{ width: '100%', marginBottom: 8 }}>
                <PrimaryButton title="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
              </View>
            )}
            {/* Tabs */}
            <ProfileTabs
              tabs={[
                { title: isOwnProfile ? 'Mis Recetas' : 'Recetas', content: <RecipeList recipes={userRecipes} favoriteIds={new Set(savedRecipes.map(r => r.id))} remindLaterIds={new Set(remindLaterRecipes.map(r => r.id))} /> },
                { title: isOwnProfile ? 'Mis Reseñas' : 'Reseñas', content: <RatingList ratings={userReviews} /> },
                { title: 'Recetas Favoritas', content: <RecipeList recipes={savedRecipes} favoriteIds={new Set(savedRecipes.map(r => r.id))} remindLaterIds={new Set(remindLaterRecipes.map(r => r.id))} /> },
                { title: 'Recetas Pendientes', content: <RecipeList recipes={remindLaterRecipes} favoriteIds={new Set(savedRecipes.map(r => r.id))} remindLaterIds={new Set(remindLaterRecipes.map(r => r.id))} /> },
              ]}
            />
            {/* Error/Loading */}
            {error || queryError ? <Text style={{ color: 'red', marginTop: 16 }}>{error || queryError?.message}</Text> : null}
            {isLoading && !error ? <Text style={{ marginTop: 16 }}>Cargando...</Text> : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
