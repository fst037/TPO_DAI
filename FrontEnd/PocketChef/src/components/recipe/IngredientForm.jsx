import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LabeledInput from '../global/inputs/LabeledInput';
import LabeledInputSelect from '../global/inputs/LabeledInputSelect';
import PrimaryButton from '../global/inputs/PrimaryButton';
import PageTitle from '../global/PageTitle';

const IngredientForm = ({
  title = '',
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = 'Guardar',
  units = [],
  ingredientOptions = [],
}) => {
  const [fields, setFields] = useState({
    quantity: initialValues.quantity || '',
    unitId: initialValues.unitId || '',
    ingredientId: initialValues.ingredientId || '',
    observations: initialValues.observations || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    let newErrors = {};
    if (!fields.quantity) newErrors.quantity = 'Cantidad requerida';
    if (!fields.unitId) newErrors.unitId = 'Unidad requerida';
    if (!fields.ingredientId) newErrors.ingredientId = 'Ingrediente requerido';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(fields);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <PageTitle>{title}</PageTitle>
        <LabeledInput
          label="Cantidad"
          value={fields.quantity}
          onChangeText={(v) => handleChange('quantity', v)}
          keyboardType="numeric"
          error={errors.quantity}
        />
        <LabeledInputSelect
          label="Unidad"
          value={fields.unitId}
          options={units.map((u) => ({
            label: u.description,
            value: u.id?.toString(),
          }))}
          onSelect={(v) => handleChange('unitId', v)}
          error={errors.unitId}
        />
        <LabeledInputSelect
          label="Ingrediente"
          value={fields.ingredientId}
          options={ingredientOptions}
          onSelect={(v) => handleChange('ingredientId', v)}
          error={errors.ingredientId}
        />
        <LabeledInput
          label="Observaciones"
          value={fields.observations}
          onChangeText={(v) => handleChange('observations', v)}
          multiline
          error={errors.observations}
        />
        <View style={{ flex: 1 }} />
        <PrimaryButton
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: 24 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
});

export default IngredientForm;
