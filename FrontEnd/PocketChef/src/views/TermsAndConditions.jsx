import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import PageTitle from '../components/global/PageTitle';
import colors from '../theme/colors';

export default function TermsAndConditions() {
  return (
    <ScrollView contentContainerStyle={{ minHeight: Dimensions.get('window').height, backgroundColor: colors.background, padding: 24 }}>
      <PageTitle style={{ marginTop: 64, marginBottom: 24, alignSelf: 'center' }}>Términos y Condiciones</PageTitle>
      <Text style={{ color: colors.mutedText, fontSize: 16, textAlign: 'left', lineHeight: 22 }}>
        Al utilizar la aplicación, aceptás cumplir con estos Términos y Condiciones, así como con nuestra Política de Privacidad vigente. El uso de la app implica tu aceptación total de estas condiciones, por lo que te recomendamos leerlas atentamente.{"\n\n"}
        Esta aplicación está destinada exclusivamente para fines personales y no comerciales. Está prohibido utilizarla con fines ilegales o no autorizados, incluyendo pero no limitado a copiar, modificar, distribuir, publicar o revender cualquier contenido de la app sin autorización expresa por escrito.{"\n\n"}
        Algunas funciones de la aplicación pueden requerir la creación de una cuenta de usuario. En ese caso, sos responsable de proporcionar información precisa, completa y actualizada, así como de mantener la confidencialidad de tus credenciales y del uso de tu cuenta.{"\n\n"}
        Si decidís compartir contenido como recetas, comentarios, imágenes u otros elementos dentro de la app, declarás que tenés los derechos necesarios para hacerlo y nos otorgás una licencia no exclusiva, gratuita, transferible y sublicenciable para utilizar, reproducir, modificar, adaptar, mostrar y distribuir dicho contenido en la app y sus canales relacionados.{"\n\n"}
        Nos reservamos el derecho, sin previo aviso, de revisar, moderar, rechazar o eliminar cualquier contenido que infrinja estos términos, que resulte ofensivo, inapropiado o que pueda perjudicar a otros usuarios o a la integridad de la plataforma.{"\n\n"}
        Todo el contenido original presente en la app, incluyendo pero no limitado a diseño, código, textos, logotipos, íconos, imágenes y funcionalidades, es propiedad de [Nombre de la Empresa o Desarrollador] o de sus licenciantes, y está protegido por leyes de propiedad intelectual, marcas y derechos de autor.{"\n\n"}
        La aplicación se proporciona “tal cual” y “según disponibilidad”, sin garantías de funcionamiento ininterrumpido, libre de errores o seguro frente a posibles vulnerabilidades. No asumimos responsabilidad por ningún tipo de daño derivado del uso o la imposibilidad de uso de la app, incluyendo pérdidas de datos o interrupciones en el servicio.{"\n\n"}
        Nos reservamos el derecho de suspender, limitar o cancelar cuentas de usuario en caso de detectar actividades que infrinjan estos Términos y Condiciones, representen un abuso de la plataforma, o pongan en riesgo la experiencia de otros usuarios.{"\n\n"}
        La app puede contener enlaces a sitios web o servicios de terceros. No controlamos ni asumimos responsabilidad sobre el contenido, disponibilidad, prácticas de privacidad ni funcionamiento de dichos servicios externos.{"\n\n"}
        Estos Términos y Condiciones se regirán e interpretarán conforme a las leyes de [país o jurisdicción], y cualquier conflicto relacionado con la aplicación deberá resolverse ante los tribunales competentes de dicha jurisdicción. El uso continuado de la aplicación después de cualquier cambio en los términos implicará tu aceptación de los mismos.
      </Text>
    </ScrollView>
  );
}
