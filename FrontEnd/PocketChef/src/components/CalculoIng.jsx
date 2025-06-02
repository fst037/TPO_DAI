import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const CalculoIng = ({ usedIngredients }) => {

  return (
    <SafeAreaView style={styles.todaLaInformacion}>
        <View style={styles.seccionTexto}>
          <Text style={styles.titulo}>Ingredientes</Text>
        </View>
      <View style={styles.headerContainer}>
        <Text style={styles.descripcion}>Hola</Text>
        <View style={styles.contenedorMedida}>
          <View style={styles.rectangulo}>
            <Text style={styles.textoMedida}>20</Text>
          </View>
          <Text style={styles.unidad}>g</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  todaLaInformacion: {
    flex: 1,
    marginTop: 30,
    justifyContent: "flex-start",
  },
  seccionTexto: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Roboto Flex",
    color: "#000",
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 15,
    fontFamily: "RobotoFlex-Regular",
    color: "#000",
    textAlign: "justify",
  },
  contenedorMedida: {
    flexDirection: "row",
    alignItems: "center",
  },
  rectangulo: {
    height: 24,
    width: 43, // más angosto
    borderWidth: 0.3,
    borderColor: "#bfbfbf",
    borderRadius: 11,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 1,
    elevation: 0.25,
    shadowRadius: 0.25,
    shadowOffset: { width: 0, height: 0.25 },
    shadowColor: "rgba(0, 0, 0, 0.25)",
  },
  textoMedida: {
    fontSize: 13,
    fontFamily: "RobotoFlex-Regular",
    color: "#000",
    letterSpacing: 0.7,
    textAlign: "center",
  },
  unidad: {
    fontSize: 13,
    fontFamily: "RobotoFlex-Regular",
    color: "#000",
    letterSpacing: 0.7,
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
});

export default CalculoIng;
