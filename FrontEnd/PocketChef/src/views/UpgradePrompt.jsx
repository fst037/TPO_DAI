import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import PageTitle from '../components/global/PageTitle';
import colors from '../theme/colors';

export default function UpgradePrompt({ navigation }) {
  return (
    <View style={styles.container}>
      <PageTitle>Mejorar a alumno</PageTitle>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💳</Text>
      </View>
      <Text style={styles.title}>
        Agregá tu método de pago
      </Text>
      <Text style={styles.text}>
        Para mejorar a alumno necesitás agregar una tarjeta como método de pago. No se realizará ningún cobro hasta que te inscribas a un curso.
      </Text>
      <PrimaryButton
        title="Continuar"
        onPress={() => navigation.navigate('AddCard')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.primary + '20',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.text,
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
});
