import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getAllRecipeTypes } from '../../services/recipeTypes';
import { getAllIngredients } from '../../services/ingredients';
import { getAllRecipes } from '../../services/recipes';
import { getUsers } from '../../services/users';
import { getAllCourses, filterCourses } from '../../services/courses'; 
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import colors from '../../theme/colors';
import LabeledInput from '../global/inputs/LabeledInput';

export default function CourseSearchBar({  
  style,
  onSearch,
  initialFilters = {},
}) {

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    courseName: initialFilters.courseName || '',
    courseMode: initialFilters.courseMode|| '',
    orderByAge: initialFilters.orderByAge || ''
  });
  const sortOptions = [{ label: 'Fecha de Creación', value: true }, { label: 'A-Z', value: false }]
  const courseModeOptions = useState(['Online', 'Presencial', 'Híbrido']);

  useEffect(() => {
    async function fetchFilters() {

      // Recipe types
      const typeRes = await getAllRecipeTypes();
      if (Array.isArray(typeRes.data)) {
        setRecipeTypeOptions([
          { value: '', label: 'Todos' },
          ...typeRes.data.map(rt => ({ value: rt.id, label: rt.description })),
        ]);
      }
    }
    fetchFilters();
  }, []);

  // When filters change, call onFiltersChange immediately
  const handleFilterChange = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);

    console.log('filters updated:', updated);    
  };

  handleSearch = () => {
    onSearch(localFilters);
    setFiltersOpen(false);
  }
  

  return (
    <>
      <View style={[styles.container, style]}>
        <TouchableOpacity style={styles.iconButtonLeft} onPress={handleSearch}>
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Buscar curso..."
          placeholderTextColor={colors.mutedText}
          value={localFilters.courseName}
          onChangeText={val => handleFilterChange('courseName', val)}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.iconButtonRight} onPress={() => setFiltersOpen(o => !o)}>
          <Ionicons name="options-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {filtersOpen && (
        <View style={styles.filtersPanel}>
          <ScrollView>
            <LabeledInputSelect
              label="Modalidad"
              value={localFilters.courseMode}
              options={courseModeOptions}
              onSelect={val => handleFilterChange('courseMode', val)}
              style={{ marginVertical: 6 }}
            />
            <LabeledInputSelect
              label="Ordenar por"
              value={localFilters.orderByAge}
              options={sortOptions}
              onSelect={val => handleFilterChange('orderByAge', val)}
              style={{ marginVertical: 6 }}
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
