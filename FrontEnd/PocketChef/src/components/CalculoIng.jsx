import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DropdownSelector from './DropdownSelector';

const CalculoIng = ({ usedIngredients, people, servings }) => {
  const [seleccion, setSeleccion] = useState("Platos");
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(people);
  
  const formatearUnidad = (unidad) => {
    if (!unidad) return '';
    const u = unidad.toLowerCase();
    if (u === 'gramos') return 'gr';
    if (u === 'kilos') return 'kg';
    return unidad;
  };

  const calcularCantidad = (cantidadOriginal) => {
    return (cantidadOriginal * cantidadSeleccionada).toFixed(2);
  };

  const cantidadOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.todaLaInformacion}>
      <View style={styles.seccionTextoConDropdown}>
        <View style={styles.tituloConDropdowns}>
          <Text style={styles.titulo}>Ingredientes</Text>
          
          <View style={styles.dropdownAgrupado}>
            <DropdownSelector
              options={["Platos", "Porciones"]}
              selectedOption={seleccion}
              onSelect={setSeleccion}
              placeholder="Seleccionar"
            />
            
            <DropdownSelector
              options={cantidadOptions}
              selectedOption={cantidadSeleccionada}
              onSelect={setCantidadSeleccionada}
              placeholder="Cantidad"
              isSmall={true}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={usedIngredients}
        keyExtractor={(item) => item.idUsedIngredient.toString()}
        renderItem={({ item: ingredient }) => (
          <View style={styles.headerContainer}>
            <Text style={styles.descripcion}>• {ingredient.ingredientName}</Text>
            <View style={styles.contenedorMedida}>
              <View style={styles.rectangulo}>
                <Text style={styles.textoMedida}>
                  {calcularCantidad(ingredient.quantity)}
                </Text>
              </View>
              <Text style={styles.unidad}>{formatearUnidad(ingredient.unitDescription)}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  todaLaInformacion: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'flex-start',
  },
  seccionTextoConDropdown: {
    marginBottom: 20,
  },
  tituloConDropdowns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  titulo: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Roboto Flex',
    color: '#000',
    letterSpacing: 0.7,
    marginLeft: 22,
    marginRight: 5,
  },
  dropdownAgrupado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descripcion: {
    fontSize: 15,
    fontFamily: 'RobotoFlex-Regular',
    color: '#000',
    textAlign: 'justify',
  },
  contenedorMedida: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rectangulo: {
    height: 24,
    width: 43,
    borderWidth: 0.3,
    borderColor: '#bfbfbf',
    borderRadius: 11,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 1,
    elevation: 0.25,
    shadowRadius: 0.25,
    shadowOffset: { width: 0, height: 0.25 },
    shadowColor: 'rgba(0, 0, 0, 0.25)',
  },
  textoMedida: {
    fontSize: 13,
    fontFamily: 'RobotoFlex-Regular',
    color: '#000',
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  unidad: {
    fontSize: 13,
    fontFamily: 'RobotoFlex-Regular',
    color: '#000',
    letterSpacing: 0.7,
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
});

export default CalculoIng;