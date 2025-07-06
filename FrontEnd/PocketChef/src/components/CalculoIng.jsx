// En CalculoIng.js - Reemplaza el FlatList con un map simple
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DropdownSelector from './DropdownSelector';
import ProtectLoggedIn from './global/ProtectLoggedIn';
import FoodCooking from '../../assets/FoodCooking.svg';
import colors from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import OptionsModal from './global/modals/OptionsModal';
import ConfirmationModal from './global/modals/ConfirmationModal';
import { removeIngredientFromRecipe } from '../services/recipes';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

const CalculoIng = ({ usedIngredients, people, servings, isMine, navigation, id, setAlert }) => {
  navigation = useNavigation()
  const [seleccion, setSeleccion] = useState("Platos");
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(people);
  const queryClient = useQueryClient();

  const formatearUnidad = (unidad) => {
    if (!unidad) return '';
    const u = unidad.toLowerCase();
    if (u === 'gramos') return 'gr';
    if (u === 'kilos') return 'kg';
    return unidad;
  };

  const [ingredientMenuVisible, setIngredientMenuVisible] = useState({}); // { [ingredientId]: boolean }
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  // Ingredient menu handlers
  const openIngredientMenu = (ingredientId) => {
    setIngredientMenuVisible(prev => ({ ...prev, [ingredientId]: true }));
  };
  const closeIngredientMenu = (ingredientId) => {
    setIngredientMenuVisible(prev => ({ ...prev, [ingredientId]: false }));
  };
  const handleEditIngredient = (ingredient) => {    
    setIngredientMenuVisible(prev => ({ ...prev, [ingredient.idUsedIngredient]: false }));    
    navigation.navigate('EditIngredient', { recipeId: id, ingredient: ingredient });
  };
  const handleDeleteIngredient = (ingredient) => {
    setIngredientToDelete(ingredient);
    setIngredientMenuVisible(prev => ({ ...prev, [ingredient.idUsedIngredient || ingredient.id]: false }));
    setShowConfirmDelete(true); // Show confirmation modal
  };
  const confirmDeleteIngredient = async () => {    
    if (!ingredientToDelete) return;
    try {
      await removeIngredientFromRecipe(id, ingredientToDelete.idUsedIngredient || ingredientToDelete.id);      
      setIngredientToDelete(null);
      setShowConfirmDelete(false); // Hide confirmation modal
      queryClient.invalidateQueries(['recipe', id]);
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar el ingrediente.' });
      setShowConfirmDelete(false); // Hide confirmation modal
    }
  };

  return (
    <SafeAreaView style={styles.todaLaInformacion}>
      <View style={styles.seccionTextoConDropdown}>
        <View style={styles.tituloConDropdowns}>
          <FoodCooking width={30} height={30} style={{ marginRight: 0 }} />
          <Text style={styles.titulo}>Ingredientes</Text>
          <View style={styles.dropdownAgrupado}>
            <ProtectLoggedIn onPress={() => {}} activeOpacity={1}>
              <DropdownSelector
                options={["Platos", "Porciones"]}
                selectedOption={seleccion}
                onSelect={setSeleccion}
                placeholder="Seleccionar"
              />
            </ProtectLoggedIn>
            <ProtectLoggedIn onPress={() => {}} activeOpacity={1}>
              <DropdownSelector
                options={cantidadOptions}
                selectedOption={cantidadSeleccionada}
                onSelect={setCantidadSeleccionada}
                placeholder="Cantidad"
                isSmall={true}
              />
            </ProtectLoggedIn>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 24 }}>
        {(usedIngredients && usedIngredients.length > 0) ? (
          usedIngredients.map((ingredient) => (
            <View key={(ingredient.idUsedIngredient ? ingredient.idUsedIngredient : ingredient.id)?.toString()} style={styles.headerContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <View>
                  <Text style={[styles.descripcion, { width: (isMine ? '90%' : '100%') }]}>• {`${calcularCantidad(ingredient.quantity)} ${formatearUnidad(ingredient.unitDescription || (ingredient.unit && ingredient.unit.abbreviation))} ${ingredient.ingredientName}`}</Text>
                  {ingredient.observations ? (
                    <Text style={{ color: colors.mutedText, fontStyle: 'italic', marginLeft: 8, marginTop: 2, marginBottom: 4, }}>{ingredient.observations}</Text>
                  ) : null}
                </View>

                {isMine && (
                  <TouchableOpacity onPress={() => openIngredientMenu(ingredient.idUsedIngredient || ingredient.id)} style={{ borderRadius: 8, alignSelf: 'flex-start' }}>
                    <MaterialIcons name="more-vert" size={22} color={colors.mutedText} />
                  </TouchableOpacity>
                )}

              </View>

              {isMine && (
                <OptionsModal
                  visible={!!ingredientMenuVisible[ingredient.idUsedIngredient || ingredient.id]}
                  options={[
                    { label: 'Editar ingrediente', onPress: () => handleEditIngredient(ingredient) },
                    { label: 'Eliminar ingrediente', onPress: () => handleDeleteIngredient(ingredient), textStyle: { color: colors.danger } },
                  ]}
                  onRequestClose={() => closeIngredientMenu(ingredient.idUsedIngredient || ingredient.id)}
                />
              )}
            </View>
          ))
        ) : (
          <Text style={{ color: colors.mutedText, marginBottom:8 }}>No hay ingredientes disponibles.</Text>
        )}
        {isMine && (
          <TouchableOpacity
            style={styles.addStepBox}
            onPress={() => navigation.navigate('CreateIngredient', { recipeId: id })}
          >
            <Text style={styles.addStepText}>+ Agregar ingrediente</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Confirmation Modal for deleting ingredient */}
      <ConfirmationModal
        visible={showConfirmDelete}
        title="¿Eliminar ingrediente?"
        message="¿Estás seguro de que deseas eliminar este ingrediente? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteIngredient}
        onCancel={() => { setShowConfirmDelete(false); setIngredientToDelete(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmColor={colors.danger}
        cancelColor={colors.secondaryBackground}
        onRequestClose={() => { setShowConfirmDelete(false); setIngredientToDelete(null); }}
      />
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
    marginBottom: 8,
  },
  addStepBox: {
      borderWidth: 2,
      borderStyle: 'dotted',
      borderColor: colors.inputBorder,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    addStepText: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
    },
});

export default CalculoIng;