// En CalculoIng.js - Reemplaza el FlatList con un map simple
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import DropdownSelector from './DropdownSelector';
import FoodCooking from '../../assets/FoodCooking.svg';
import colors from '../theme/colors';

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
    const base = seleccion === "Platos" ? people : servings;
    const proporcion = cantidadSeleccionada / base;
    return (cantidadOriginal * proporcion).toFixed(2);
  };

  const cantidadOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    if (seleccion === "Platos") {
      setCantidadSeleccionada(people);
    } else {
      setCantidadSeleccionada(servings);
    }
  }, [seleccion, people, servings]);

  return (
    <SafeAreaView style={styles.todaLaInformacion}>
      <View style={styles.seccionTextoConDropdown}>
        <View style={styles.tituloConDropdowns}>
          <FoodCooking width={30} height={30} style={{ marginRight: 0 }} />
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

      {/* Reemplazar FlatList con map */}
      <View>
        {usedIngredients.map((ingredient) => (
          <View key={ingredient.idUsedIngredient.toString()} style={styles.headerContainer}>
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
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  todaLaInformacion: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.clickableText
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