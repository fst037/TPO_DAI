import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../theme/colors';
import { NoAuth } from '../services/api';
import { useQuery } from '@tanstack/react-query';

export default function Home({ navigation }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => NoAuth('/users').then(res => res.data),
  });

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }} keyboardShouldPersistTaps="handled">
      <View style={{ minHeight: Dimensions.get('window').height }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 18 }}>
          <PrimaryButton
            title="Iniciar sesión"
            onPress={() => navigation.navigate('Login')}
            style={{ width: 140, paddingVertical: 8, paddingHorizontal: 0, borderRadius: 10, marginVertical: 0 }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {isLoading && <Text>Cargando...</Text>}
          {error && <Text style={{ color: 'red' }}>Error: {error.message}</Text>}
          {data && <Text style={styles.title}>¡Bienvenido, Usuario Invitado!</Text>}
        </View>
        <StatusBar barStyle="dark-content" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
});
