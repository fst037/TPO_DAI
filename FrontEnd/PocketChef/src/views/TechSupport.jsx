import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import PageTitle from '../components/global/PageTitle';
import colors from '../theme/colors';

export default function TechSupport() {
  return (
    <View style={{ minHeight: Dimensions.get('window').height, backgroundColor: colors.background, padding: 24 }}>
      <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center' }}>Soporte Técnico</PageTitle>
      <Text style={{ color: colors.mutedText, fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
        Si tenés dudas, problemas con la app o simplemente querés hacernos una sugerencia, no dudes en escribirnos. Podés mandarnos un correo a <Text style={{ color: colors.primary }}>chefdebolsillo@gmail.com</Text> contándonos qué te pasó, qué parte de la app estabas usando y cómo fue tu experiencia. Cuanta más información nos des, mejor podremos ayudarte. Si es posible, adjuntá una captura de pantalla o video del problema, así lo resolvemos más rápido.
        {"\n"}
        Estamos para ayudarte y siempre agradecemos tus comentarios, ya que nos permiten mejorar la aplicación para todos.
      </Text>
    </View>
  );
}
