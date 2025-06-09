import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LabeledInput from '../global/inputs/LabeledInput';
import PrimaryButton from '../global/inputs/PrimaryButton';
import AlertModal from '../global/modals/AlertModal';
import PageTitle from '../global/PageTitle';
import colors from '../../theme/colors';

export default function StepForm({
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = 'Guardar',
  title,
}) {
  const [fields, setFields] = useState({
    text: '',
    ...initialValues,
  });
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFields(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!fields.text) {
      setAlert({ visible: true, title: 'Error', message: 'El texto del paso es obligatorio.' });
      return;
    }
    onSubmit(fields);
  };

  // Validation for required fields
  const isFormValid = fields.text && !loading;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: colors.background, minHeight: '100%' }}>
        <PageTitle style={{ marginTop: 64, marginBottom: 16, alignSelf: 'center' }}>{title}</PageTitle>
        <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', paddingHorizontal: 24 }}>
          <LabeledInput
            label="Descripción del paso"
            value={fields.text}
            onChangeText={v => handleChange('text', v)}
            multiline
          />
          <AlertModal
            visible={alert.visible}
            title={alert.title}
            message={alert.message}
            onRequestClose={() => setAlert({ ...alert, visible: false })}
          />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ width: '100%', paddingHorizontal: 24, paddingBottom: 24 }}>
          <PrimaryButton
            title={loading ? 'Guardando...' : submitLabel}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: colors.background,
    padding: 24,
    borderRadius: 16,
    justifyContent: 'center',
  },
});
