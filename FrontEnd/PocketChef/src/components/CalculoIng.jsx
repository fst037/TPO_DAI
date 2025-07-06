// En CalculoIng.js - Con ajuste proporcional correcto
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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

  // Estado para las cantidades base ajustadas de todos los ingredientes
  const [adjustedQuantities, setAdjustedQuantities] = useState({});
  const [adjustedServings, setAdjustedServings] = useState({ people, servings });

  const formatearUnidad = (unidad) => {
    if (!unidad) return '';
    const u = unidad.toLowerCase();
    if (u === 'gramos') return 'gr';
    if (u === 'kilos') return 'kg';
    if (u === 'mililitros') return 'ml';
    if (u === 'unidades') return 'ud';
    if (u === 'cucharadas') return 'cdas';
    if (u === 'tazas') return 'tzs';
    if (u === 'litros') return 'l';
    return unidad;
  };

  const [ingredientMenuVisible, setIngredientMenuVisible] = useState({});
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // Estados para el editor inline
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  // Inicializar cantidades ajustadas cuando cambien los ingredientes
  useEffect(() => {
    if (usedIngredients && usedIngredients.length > 0) {
      const initialQuantities = {};
      usedIngredients.forEach(ingredient => {
        const ingredientId = ingredient.idUsedIngredient || ingredient.id;
        initialQuantities[ingredientId] = ingredient.quantity;
      });
      setAdjustedQuantities(initialQuantities);
      setAdjustedServings({ people, servings });
    }
  }, [usedIngredients, people, servings]);

  // Función para obtener la cantidad actual (ajustada o original)
  const getCurrentQuantity = (ingredient) => {
    const ingredientId = ingredient.idUsedIngredient || ingredient.id;
    return adjustedQuantities[ingredientId] || ingredient.quantity;
  };

  // Función para obtener las porciones/platos actuales
  const getCurrentServings = () => {
    return seleccion === "Platos" ? adjustedServings.people : adjustedServings.servings;
  };

  const calcularCantidad = (cantidadActual) => {
    const currentExpected = getCurrentServings();
    const proporcion = cantidadSeleccionada / currentExpected;
    return (cantidadActual * proporcion).toFixed(2);
  };

  const cantidadOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    setCantidadSeleccionada(getCurrentServings());
  }, [seleccion, adjustedServings]);

  // Manejar cambios en el dropdown de cantidad
  const handleCantidadChange = (newCantidad) => {
    setCantidadSeleccionada(newCantidad);
    
    // Calcular el factor de proporción basado en el cambio en el dropdown
    const currentExpected = getCurrentServings();
    const proportionFactor = newCantidad / currentExpected;
    
    // Actualizar TODAS las cantidades proporcionalmente
    const newAdjustedQuantities = {};
    usedIngredients.forEach(ing => {
      const ingId = ing.idUsedIngredient || ing.id;
      const currentQty = adjustedQuantities[ingId] || ing.quantity;
      newAdjustedQuantities[ingId] = currentQty * proportionFactor;
    });
    
    // Actualizar las porciones/platos proporcionalmente
    const newAdjustedServings = {
      people: seleccion === "Platos" ? newCantidad : Math.round(adjustedServings.people * proportionFactor),
      servings: seleccion === "Porciones" ? newCantidad : Math.round(adjustedServings.servings * proportionFactor)
    };

    setAdjustedQuantities(newAdjustedQuantities);
    setAdjustedServings(newAdjustedServings);
  };

  // Funciones para el editor inline
  const startEditingQuantity = (ingredient) => {
    const ingredientId = ingredient.idUsedIngredient || ingredient.id;
    setEditingIngredient(ingredientId);
    const currentQuantity = getCurrentQuantity(ingredient);
    setEditingQuantity(currentQuantity.toString());
  };

  const cancelEditingQuantity = () => {
    setEditingIngredient(null);
    setEditingQuantity('');
  };

  const saveQuantityChange = (ingredient) => {
    const ingredientId = ingredient.idUsedIngredient || ingredient.id;
    const originalQuantity = ingredient.quantity;
    const currentQuantity = getCurrentQuantity(ingredient);
    
    if (!editingQuantity || editingQuantity === currentQuantity.toString()) {
      cancelEditingQuantity();
      return;
    }

    const newQuantity = parseFloat(editingQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      setAlert({ visible: true, title: 'Error', message: 'La cantidad debe ser un número válido mayor a 0.' });
      cancelEditingQuantity();
      return;
    }

    // Calcular el factor de proporción basado en este ingrediente
    const proportionFactor = newQuantity / originalQuantity;
    
    // Actualizar TODAS las cantidades proporcionalmente
    const newAdjustedQuantities = {};
    usedIngredients.forEach(ing => {
      const ingId = ing.idUsedIngredient || ing.id;
      newAdjustedQuantities[ingId] = ing.quantity * proportionFactor;
    });
    
    // Actualizar las porciones/platos proporcionalmente
    const newAdjustedServings = {
      people: Math.round(people * proportionFactor),
      servings: Math.round(servings * proportionFactor)
    };

    setAdjustedQuantities(newAdjustedQuantities);
    setAdjustedServings(newAdjustedServings);
    
    // Actualizar la cantidad seleccionada para reflejar el cambio
    const newCantidadSeleccionada = seleccion === "Platos" 
      ? newAdjustedServings.people
      : newAdjustedServings.servings;
    setCantidadSeleccionada(newCantidadSeleccionada);

    cancelEditingQuantity();
  };

  // Función para resetear a las cantidades originales
  const resetToOriginal = () => {
    const originalQuantities = {};
    usedIngredients.forEach(ingredient => {
      const ingredientId = ingredient.idUsedIngredient || ingredient.id;
      originalQuantities[ingredientId] = ingredient.quantity;
    });
    setAdjustedQuantities(originalQuantities);
    setAdjustedServings({ people, servings });
    setCantidadSeleccionada(seleccion === "Platos" ? people : servings);
  };

  // Verificar si las cantidades han sido modificadas
  const isModified = () => {
    return adjustedServings.people !== people || adjustedServings.servings !== servings;
  };

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
    setShowConfirmDelete(true);
  };
  const confirmDeleteIngredient = async () => {    
    if (!ingredientToDelete) return;
    try {
      await removeIngredientFromRecipe(id, ingredientToDelete.idUsedIngredient || ingredientToDelete.id);      
      setIngredientToDelete(null);
      setShowConfirmDelete(false);
      queryClient.invalidateQueries(['recipe', id]);
    } catch (err) {
      setAlert({ visible: true, title: 'Error', message: err.message || 'No se pudo eliminar el ingrediente.' });
      setShowConfirmDelete(false);
    }
  };

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
              onSelect={handleCantidadChange}
              placeholder="Cantidad"
              isSmall={true}
            />
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 24 }}>

        {/* Botón para resetear a cantidades originales */}
        {isModified() && (
          <TouchableOpacity onPress={resetToOriginal} style={styles.resetButton}>
            <MaterialIcons name="refresh" size={18} color={colors.primary} />
            <Text style={styles.resetButtonText}>Volver a cantidades originales</Text>
          </TouchableOpacity>
        )}
        
        {(usedIngredients && usedIngredients.length > 0) ? (
          usedIngredients.map((ingredient) => {
            const ingredientId = ingredient.idUsedIngredient || ingredient.id;
            const isEditing = editingIngredient === ingredientId;
            const currentQuantity = getCurrentQuantity(ingredient);
            const displayQuantity = calcularCantidad(currentQuantity);
            
            return (
              <View key={ingredientId?.toString()} style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.ingredientRow}>
                      <Text style={styles.bulletPoint}>• </Text>
                      <Text style={styles.ingredientName}>{ingredient.ingredientName}</Text>
                      <View style={styles.dottedLine} />
                      <View style={styles.quantityContainer}>
                        {isEditing ? (
                          <TextInput
                            style={styles.quantityInput}
                            value={editingQuantity}
                            onChangeText={setEditingQuantity}
                            keyboardType="numeric"
                            autoFocus
                            selectTextOnFocus
                            onSubmitEditing={() => saveQuantityChange(ingredient)}
                            onBlur={() => saveQuantityChange(ingredient)}
                          />
                        ) : (
                          <ProtectLoggedIn onPress={() => startEditingQuantity(ingredient)}>
                            <View style={styles.quantityBox}>
                              <Text style={[
                                styles.quantityText,
                                isModified() && styles.modifiedQuantity
                              ]}>
                                {displayQuantity}
                              </Text>
                            </View>
                          </ProtectLoggedIn>
                        )}
                        <Text style={styles.unitText}>
                          {formatearUnidad(ingredient.unitDescription || (ingredient.unit && ingredient.unit.abbreviation))}
                        </Text>
                      </View>
                    </View>
                    {ingredient.observations ? (
                      <Text style={styles.observations}>{ingredient.observations}</Text>
                    ) : null}
                  </View>

                  {isMine && (
                    <TouchableOpacity 
                      onPress={() => openIngredientMenu(ingredientId)} 
                      style={styles.menuButton}
                    >
                      <MaterialIcons name="more-vert" size={22} color={colors.mutedText} />
                    </TouchableOpacity>
                  )}
                </View>

                {isMine && (
                  <OptionsModal
                    visible={!!ingredientMenuVisible[ingredientId]}
                    options={[
                      { label: 'Editar ingrediente', onPress: () => handleEditIngredient(ingredient) },
                      { label: 'Eliminar ingrediente', onPress: () => handleDeleteIngredient(ingredient), textStyle: { color: colors.danger } },
                    ]}
                    onRequestClose={() => closeIngredientMenu(ingredientId)}
                  />
                )}
              </View>
            );
          })
        ) : (
          <Text style={{ color: colors.mutedText, marginBottom: 8 }}>No hay ingredientes disponibles.</Text>
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
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  bulletPoint: {
    fontSize: 15,
    fontFamily: 'RobotoFlex-Regular',
    color: '#000',
    marginRight: 8,
  },
  ingredientName: {
    fontSize: 15,
    fontFamily: 'RobotoFlex-Regular',
    color: '#000',
  },
  dottedLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderStyle: 'dotted',
    marginHorizontal: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 160,
    justifyContent: 'flex-end',
    marginLeft: 5,
    marginTop: 10
  },
  quantityBox: {
    minWidth: 60,
    height: 32,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  quantityText: {
    fontSize: 15,
    fontFamily: 'RobotoFlex-Regular',
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'RobotoFlex-Regular',
    color: '#666',
    minWidth: 10,
    textAlign: 'left',
  },
  modifiedQuantity: {
    color: '#FF6B35',
  },
  quantityInput: {
    fontSize: 15,
    fontFamily: 'RobotoFlex-Regular',
    color: '#FF6B35',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 60,
    height: 32,
    textAlign: 'center',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight || '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'RobotoFlex-Regular',
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  proportionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight || '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  proportionText: {
    fontSize: 14,
    fontFamily: 'RobotoFlex-Regular',
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '500',
    flex: 1,
  },
  observations: {
    color: colors.mutedText,
    fontStyle: 'italic',
    marginLeft: 8,
    marginTop: 1,
    marginBottom: 2,
    fontSize: 13,
  },
  menuButton: {
    borderRadius: 8,
    alignSelf: 'flex-start',
    padding: 4,
    paddingTop: 15,
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
    marginBottom: 6,
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