import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

export default function UserOptions({ navigation, route }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = route?.params?.user || {};

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
    navigation.navigate('StudentRegister', {
      userId: user.id,
      userEmail: user.email
    });
  };

  return (
    <View style={{ minHeight: Dimensions.get('window').height, backgroundColor: colors.background, padding: 24 }}>
      <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center' }}>Opciones de Usuario</PageTitle>
      {/* Upgrade to student if not student */}
      {user && user.studentId == null && (
        <PrimaryButton
          title="Mejorar a Estudiante"
          onPress={handleUpgradeToStudent}
          style={{ marginBottom: 12 }}
        />
      )}
      {/* List-style options with icons */}
      <View style={{ backgroundColor: colors.background, borderRadius: 16, paddingVertical: 4, marginBottom: 12, elevation: 1 }}>
        {user && user.studentId != null && (
          <>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => {/* TODO: Implement credit cards flow */}}>
              <MaterialIcons name="credit-card" size={22} color={colors.primary} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Mis tarjetas</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => {/* TODO: Implement courses flow */}}>
              <MaterialIcons name="school" size={22} color={colors.primary} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Mis cursos</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.secondaryBackground, marginHorizontal: 8 }} />
          </>
        )}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.replace('BookMarkedRecipes')}>
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
          <MaterialIcons name="gavel" size={22} color={colors.primary} style={{ marginRight: 16 }} />
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
