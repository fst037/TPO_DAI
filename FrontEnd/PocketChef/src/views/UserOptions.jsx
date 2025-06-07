import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import PageTitle from '../components/global/PageTitle';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import SecondaryButton from '../components/global/inputs/SecondaryButton';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function UserOptions({ navigation, route }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = route?.params?.user || {};

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await AsyncStorage.removeItem('token');
    navigation.replace('Home');
  };

  return (
    <View style={{ minHeight: Dimensions.get('window').height, backgroundColor: '#fff', padding: 24 }}>
      <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center' }}>Opciones de Usuario</PageTitle>
      {/* Upgrade to student if not student */}
      {user && user.studentId == null && (
        <PrimaryButton
          title="Mejorar a Estudiante"
          onPress={() => {/* TODO: Implement upgrade flow */}}
          style={{ marginBottom: 12 }}
        />
      )}
      {/* List-style options with icons */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingVertical: 4, marginBottom: 12, elevation: 1 }}>
        {user && user.studentId != null && (
          <>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => {/* TODO: Implement credit cards flow */}}>
              <MaterialIcons name="credit-card" size={22} color="#ED802A" style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Mis tarjetas</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => {/* TODO: Implement courses flow */}}>
              <MaterialIcons name="school" size={22} color="#ED802A" style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Mis cursos</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
          </>
        )}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.replace('Profile', { tab: 2 })}>
          <MaterialIcons name="bookmark" size={22} color="#ED802A" style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: '#333' }}>Recetas guardadas</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('TechSupport')}>
          <MaterialIcons name="support-agent" size={22} color="#ED802A" style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: '#333' }}>Soporte técnico</Text>
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#eee', marginHorizontal: 8 }} />
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }} onPress={() => navigation.navigate('TermsAndConditions')}>
          <MaterialIcons name="gavel" size={22} color="#ED802A" style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, color: '#333' }}>Términos y Condiciones</Text>
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
