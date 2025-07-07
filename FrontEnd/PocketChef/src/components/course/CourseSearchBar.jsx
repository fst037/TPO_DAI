import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getAllBranches } from '../../services/branches';
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import colors from '../../theme/colors';
import LabeledInput from '../global/inputs/LabeledInput';
import DatePicker from '../global/inputs/DatePicker';

// Helper component for side-by-side min/max inputs
const SideBySideInputs = ({ 
  leftLabel, 
  rightLabel, 
  leftValue, 
  rightValue, 
  leftPlaceholder, 
  rightPlaceholder, 
  onLeftChange, 
  onRightChange, 
  keyboardType = 'default' 
}) => (
  <View style={styles.sideBySideContainer}>
    <View style={styles.halfWidth}>
      <LabeledInput
        label={leftLabel}
        value={leftValue}
        onChangeText={onLeftChange}
        placeholder={leftPlaceholder}
        keyboardType={keyboardType}
      />
    </View>
    <View style={styles.halfWidth}>
      <LabeledInput
        label={rightLabel}
        value={rightValue}
        onChangeText={onRightChange}
        placeholder={rightPlaceholder}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default function CourseSearchBar({  
  style,
  onSearch,
  initialFilters = {},
}) {

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    courseName: initialFilters.courseName || '',
    modality: initialFilters.modality || '',
    branchIds: initialFilters.branchIds || [],
    minStartDate: initialFilters.minStartDate || '',
    maxEndDate: initialFilters.maxEndDate || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    minDuration: initialFilters.minDuration || '',
    maxDuration: initialFilters.maxDuration || ''
  });
  
  const [branchOptions, setBranchOptions] = useState([]);
  
  const modalityOptions = [
    { label: 'Todas', value: '' },
    { label: 'Online', value: 'Online' },
    { label: 'Presencial', value: 'Presencial' }
  ];

  useEffect(() => {
    async function fetchFilters() {
      try {
        // Fetch branches for branch filter
        const branchRes = await getAllBranches();
        if (Array.isArray(branchRes.data)) {
          const options = branchRes.data.map(branch => ({ 
            value: branch.id, 
            label: branch.name 
          }));
          setBranchOptions(options);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranchOptions([]);
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

  const handleSearch = () => {
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
              value={localFilters.modality}
              options={modalityOptions}
              onSelect={val => handleFilterChange('modality', val)}
              style={{ marginVertical: 6 }}
            />
            <LabeledInputSelect
              label="Sucursales"
              value={localFilters.branchIds}
              options={branchOptions}
              onSelect={val => handleFilterChange('branchIds', val)}
              style={{ marginVertical: 6 }}
              multiple
            />
            
            {/* Date Inputs */}
            <DatePicker
              label="Fecha mínima de inicio"
              value={localFilters.minStartDate}
              onDateChange={val => handleFilterChange('minStartDate', val)}
              placeholder="Seleccionar fecha de inicio"
            />
            <DatePicker
              label="Fecha máxima de finalización"
              value={localFilters.maxEndDate}
              onDateChange={val => handleFilterChange('maxEndDate', val)}
              placeholder="Seleccionar fecha de finalización"
            />
            
            {/* Price Inputs */}
            <SideBySideInputs
              leftLabel="Precio mínimo"
              rightLabel="Precio máximo"
              leftValue={localFilters.minPrice}
              rightValue={localFilters.maxPrice}
              leftPlaceholder="5000"
              rightPlaceholder="100000"
              onLeftChange={val => handleFilterChange('minPrice', val)}
              onRightChange={val => handleFilterChange('maxPrice', val)}
              keyboardType="numeric"
            />
            
            {/* Duration Inputs */}
            <SideBySideInputs
              leftLabel="Duración mínima (horas)"
              rightLabel="Duración máxima (horas)"
              leftValue={localFilters.minDuration}
              rightValue={localFilters.maxDuration}
              leftPlaceholder="10"
              rightPlaceholder="100"
              onLeftChange={val => handleFilterChange('minDuration', val)}
              onRightChange={val => handleFilterChange('maxDuration', val)}
              keyboardType="numeric"
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
  sideBySideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 4,
  },
});
