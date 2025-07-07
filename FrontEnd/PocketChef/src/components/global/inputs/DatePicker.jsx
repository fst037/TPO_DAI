import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function DatePicker({
  label,
  value,
  onDateChange,
  placeholder = "Seleccionar fecha",
  style,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Initialize values from existing date
  React.useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth() + 1);
        setSelectedDay(date.getDate());
      }
    }
  }, [value]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-ES');
  };

  // Generate years (current year ± 5)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // Generate months
  const generateMonths = () => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months.map((month, index) => ({ name: month, value: index + 1 }));
  };

  // Generate days for selected month/year
  const generateDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleConfirm = () => {
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    onDateChange(formattedDate);
    setShowPicker(false);
  };

  const displayValue = value ? formatDate(value) : placeholder;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={styles.dateButton} 
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {displayValue}
        </Text>
        <View style={styles.iconContainer}>
          {value && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={(e) => {
                e.stopPropagation();
                onDateChange('');
              }}
            >
              <MaterialIcons name="clear" size={18} color={colors.mutedText} />
            </TouchableOpacity>
          )}
          <MaterialIcons name="date-range" size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Año</Text>
                <FlatList
                  data={generateYears()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, selectedYear === item && styles.selectedItem]}
                      onPress={() => setSelectedYear(item)}
                    >
                      <Text style={[styles.pickerItemText, selectedYear === item && styles.selectedItemText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  style={styles.pickerList}
                />
              </View>

              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Mes</Text>
                <FlatList
                  data={generateMonths()}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, selectedMonth === item.value && styles.selectedItem]}
                      onPress={() => setSelectedMonth(item.value)}
                    >
                      <Text style={[styles.pickerItemText, selectedMonth === item.value && styles.selectedItemText]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  style={styles.pickerList}
                />
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Día</Text>
                <FlatList
                  data={generateDays()}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, selectedDay === item && styles.selectedItem]}
                      onPress={() => setSelectedDay(item)}
                    >
                      <Text style={[styles.pickerItemText, selectedDay === item && styles.selectedItemText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                  style={styles.pickerList}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontWeight: 'bold',
    color: colors.label,
    marginBottom: 8,
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#B0B0B0',
    minHeight: 48,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: colors.clickableText,
  },
  placeholderText: {
    color: colors.mutedText,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.clickableText,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.label,
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerList: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: colors.primary,
  },
  pickerItemText: {
    fontSize: 14,
    color: colors.clickableText,
    textAlign: 'center',
  },
  selectedItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
