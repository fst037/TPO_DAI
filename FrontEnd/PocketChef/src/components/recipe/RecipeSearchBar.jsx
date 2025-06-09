import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getAllRecipeTypes } from '../../services/recipeTypes';
import { getAllIngredients } from '../../services/ingredients';
import { getAllRecipes } from '../../services/recipes';
import { getUsers } from '../../services/users';
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import colors from '../../theme/colors';

export default function RecipeSearchBar({
  value,
  onChangeText,
  onFiltersChange,
  sortOptions = [{ label: 'Newest', value: "true" }, { label: 'A-Z', value: "false" }],
  style,
  filters = {},
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    includedIngredients: filters.includedIngredients || [],
    excludedIngredients: filters.excludedIngredients || [],
    recipeType: filters.recipeType || '',
    sortBy: filters.sortBy || '',
    username: filters.username || '',
  });
  const [includedIngredients, setIncludedIngredients] = useState([]);
  const [excludedIngredients, setExcludedIngredients] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    async function fetchFilters() {
      // Ingredients
      const ingRes = await getAllIngredients();
      if (Array.isArray(ingRes.data)) {
        const options = ingRes.data.map(i => ({ value: i.id, label: i.name }));
        setIncludedIngredients(options);
        setExcludedIngredients(options);
      }
      // Recipe types
      const typeRes = await getAllRecipeTypes();
      if (Array.isArray(typeRes.data)) {
        setRecipeTypes([
          { value: '', label: 'Todos' },
          ...typeRes.data.map(rt => ({ value: rt.id, label: rt.description })),
        ]);
      }
      // Users (for select)
      try {
        const usersRes = await getUsers();
        console.log('Users response:', usersRes.data);
        
        if (Array.isArray(usersRes.data)) {
          setUserOptions([
            { value: '', label: 'Todos' },
            ...usersRes.data.map(u => ({ value: u.id, label: u.nombre || u.nickname || u.email })),
          ]);
        }
      } catch (e) {
        setUserOptions([{ value: '', label: 'Todos' }]);
      }
    }
    fetchFilters();
  }, []);

  // When filters change, call onFiltersChange immediately
  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange && onFiltersChange(updated);
  };

  // When search icon is pressed, trigger filter/search (call onChangeText with current value)
  const handleSearchIconPress = () => {
    onChangeText && onChangeText(value);
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.iconButtonLeft} onPress={handleSearchIconPress}>
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Buscar receta..."
          placeholderTextColor={colors.mutedText}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={handleSearchIconPress}
        />
        <TouchableOpacity style={styles.iconButtonRight} onPress={() => setFiltersOpen(o => !o)}>
          <Ionicons name="options-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {filtersOpen && (
        <View style={styles.filtersPanel}>
          <ScrollView>
            <LabeledInputSelect
              label="Nombre de usuario"
              value={localFilters.username}
              options={userOptions}
              onSelect={val => handleFilterChange('username', val)}
            />
            <LabeledInputSelect
              label="Ingredientes incluidos"
              value={localFilters.includedIngredients}
              options={includedIngredients}
              onSelect={val => handleFilterChange('includedIngredients', val)}
              multiple
            />
            <LabeledInputSelect
              label="Ingredientes excluidos"
              value={localFilters.excludedIngredients}
              options={excludedIngredients}
              onSelect={val => handleFilterChange('excludedIngredients', val)}
              multiple
            />
            <LabeledInputSelect
              label="Tipo de receta"
              value={localFilters.recipeType}
              options={recipeTypes}
              onSelect={val => handleFilterChange('recipeType', val)}
            />
            <LabeledInputSelect
              label="Ordenar por"
              value={localFilters.sortBy}
              options={sortOptions}
              onSelect={val => handleFilterChange('sortBy', val)}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    marginTop: 0,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#B0B0B0', // fallback to grey
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.clickableText,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  iconButtonLeft: {
    padding: 8,
    marginRight: 4,
  },
  iconButtonRight: {
    padding: 8,
    marginLeft: 4,
  },
  filtersPanel: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginTop: -8, // visually attach to bar
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
    maxHeight: 350,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#B0B0B0',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: colors.label,
    marginBottom: 4,
    marginTop: 8,
  },
});
