import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function UserOptions({ navigation, route }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = route?.params?.user || {};
  const isStudent = user?.studentProfile != null && user?.studentProfile != undefined;

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    // Remove all items stored in login
    await AsyncStorage.multiRemove([
      'token',
      'user_id',
      'user_name',
      'user_nickname',
      'user_email',
    ]);
    navigation.replace('Home');
  };

  const handleUpgradeToStudent = () => {
    navigation.navigate('StudentRegisterWarning', {
      userId: user.id,
      userEmail: user.email
    });
  };

  return (
    <View style={{ minHeight: Dimensions.get('window').height, backgroundColor: colors.background, padding: 24 }}>
      <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center' }}>
        {isStudent ? 'Opciones' : 'Opciones de Usuario'}
      </PageTitle>
      
      {/* Upgrade to student if not student */}
      {user && !isStudent && (
        <PrimaryButton
          title="Mejorar a Estudiante"
          onPress={handleUpgradeToStudent}
          style={{ marginBottom: 12 }}
        />
      )}

      {/* Student-specific options */}
      {isStudent && (
        <View style={{ backgroundColor: colors.background, borderRadius: 16, paddingVertical: 2, marginBottom: 5, elevation: 1 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('Curso')}>
            <MaterialIcons name="school" size={22} color={colors.primary} style={{ marginRight: 16 }} />
            <Text style={{ fontSize: 16, color: colors.clickableText }}>Mis cursos</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('MyCards')}>
            <Feather name="credit-card" size={22} color={colors.primary} style={{ marginRight: 16 }} />
            <Text style={{ fontSize: 16, color: colors.clickableText }}>Método de Pago</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
        </View>
      )}

      {/* Common options for all users */}
      <View style={{ backgroundColor: colors.background, borderRadius: 16, paddingVertical: 2, marginBottom: 12, elevation: 1 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8 }} onPress={() => navigation.replace('BookMarkedRecipes')}>
          <MaterialIcons name="bookmark" size={22} color={colors.primary} style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: colors.clickableText }}>Marcadores</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('TechSupport')}>
          <MaterialIcons name="support-agent" size={22} color={colors.primary} style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: colors.clickableText }}>Soporte técnico</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('TermsAndConditions')}>
          <FontAwesome5 name="file-contract" size={18} color={colors.primary} style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: colors.clickableText }}>Términos y Condiciones</Text>
        </TouchableOpacity>
      </View>

      <SecondaryButton title="Cerrar sesión" onPress={handleLogout} style={{ marginBottom: 16 }} />
      
      <ConfirmationModal
        visible={showLogoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </View>
  );
}