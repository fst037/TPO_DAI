
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCourseById } from '../services/courses.js';
import { dropOutOfCourseToCreditCard, dropOutOfCourseToAppBalance } from '../services/students.js';
import { useRoute } from '@react-navigation/native';
import colors from '../theme/colors';
import PrimaryButton from '../components/global/inputs/PrimaryButton';
import { useQuery } from '@tanstack/react-query';
import ConfirmationModal from '../components/global/modals/ConfirmationModal';
import { getCourseScheduleById } from '../services/course-schedules.js';
import { whoAmI } from '../services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired } from '../utils/jwt';

export default function DropOutCourse({ navigation }) {
    const route = useRoute();
    const { id, currentId  } = route.params;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ['whoAmI'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token || isTokenExpired(token)) return null; 
            return whoAmI().then(res => res.data);
        },
        retry: false,
	});

    useEffect(() => {
        const fetchCourse = async () => {
          try {            
            const response = await getCourseScheduleById(id);
            
            setCourseData(response.data);
            setLoading(false);

          } catch (e) {            
            console.error(e.response?.data || e.message);
          }
        };
    
        if (id !== -1) {
          fetchCourse();
        }
      }, [id]);

    const { 
        course = {}, 
        branch = {},
        startDate = '',
        endDate = '',
        professorName = ''
    } = courseData || {};


    const handleConfirmDropout = () => {
        setConfirmDelete(true);
    };

    const processDropout = async () => {
        try {
            if (selectedPaymentMethod === 'card') {
                await dropOutOfCourseToCreditCard(currentId);
            } else {
                await dropOutOfCourseToAppBalance(currentId);
            }
            setConfirmDelete(false);
            Alert.alert(
                'Baja exitosa',
                'Te has dado de baja del curso exitosamente.',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            );
        } catch (error) {
            console.error('Error dropping out:', error);
            Alert.alert(
                'Error',
                'No se pudo procesar la baja del curso. Intenta nuevamente.',
                [{ text: 'OK' }]
            );
            setConfirmDelete(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solicitud de baja del curso</Text>
            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
            ) : (
                <View>
                {/* Información del curso */}
                <View style={styles.courseInfo}>
                    <Text style={styles.sectionTitle}>Curso</Text>
                    <View style={styles.courseDetails}>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>{course.description || 'Curso sin nombre'}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Modalidad:</Text>
                            <Text style={styles.courseValue}>{course.modality || 'No especificada'}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Duración:</Text>
                            <Text style={styles.courseValue}>{course.duration || 0} horas</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Inicio de la cursada:</Text>
                            <Text style={styles.courseValue}>{formatDate(startDate)}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Fin de la cursada:</Text>
                            <Text style={styles.courseValue}>{formatDate(endDate)}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Sede:</Text>
                            <Text style={styles.courseValue}>{branch.name || 'No especificada'}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Profesor:</Text>
                            <Text style={styles.courseValue}>{professorName || 'No asignado'}</Text>
                        </View>
                        <View style={styles.courseItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.courseText}>Precio:</Text>
                            <Text style={styles.courseValue}>${course.price?.toLocaleString() || '0'}</Text>
                        </View>
                    </View>
                </View>

                {/* Forma de reintegro */}
                <View style={styles.refundSection}>
                    <View style={styles.refundHeader}>
                        <Text style={styles.sectionTitle}>Forma de reintegro</Text>
                        <TouchableOpacity>
                            <Ionicons name="information-circle-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Opción Tarjeta */}
                    <TouchableOpacity 
                        style={[styles.paymentOption, selectedPaymentMethod === 'card' && styles.selectedPaymentOption]}
                        onPress={() => setSelectedPaymentMethod('card')}
                    >
                        <View style={styles.paymentOptionHeader}>
                            <View style={styles.radioContainer}>
                                <View style={[styles.radioButton, selectedPaymentMethod === 'card' && styles.radioButtonSelected]}>
                                    {selectedPaymentMethod === 'card' && <View style={styles.radioButtonInner} />}
                                </View>
                            </View>
                            <Text style={styles.paymentMethodTitle}>Tarjeta</Text>
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardNumber}>{user?.studentProfile?.cardNumber}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Cuenta corriente */}
                    <TouchableOpacity 
                        style={[styles.paymentOption, selectedPaymentMethod === 'account' && styles.selectedPaymentOption]}
                        onPress={() => setSelectedPaymentMethod('account')}
                    >
                        <View style={styles.paymentOptionHeader}>
                            <View style={styles.radioContainer}>
                                <View style={[styles.radioButton, selectedPaymentMethod === 'account' && styles.radioButtonSelected]}>
                                    {selectedPaymentMethod === 'account' && <View style={styles.radioButtonInner} />}
                                </View>
                            </View>
                            <Text style={styles.paymentMethodTitle}>Cuenta corriente</Text>
                        </View>
                        <Text style={styles.accountDescription}>Su pago será guardado para próximos pagos</Text>
                    </TouchableOpacity>
                </View>

                {/* Botones */}
                <View style={styles.buttonContainer}>
                    <PrimaryButton title="Confirmar baja" onPress={handleConfirmDropout} disabled={false}/>
                
                    <PrimaryButton title="Cancelar" onPress={() => navigation.goBack()} style={styles.cancelButton} />
                </View>
                <ConfirmationModal
                    visible={confirmDelete}
                    title="¿Estás seguro?"
                    message="Esta acción no se puede deshacer."
                    onConfirm={processDropout}
                    onCancel={() => setConfirmDelete(false)}
                    confirmLabel="Eliminar"
                    cancelLabel="Cancelar"
                    confirmColor={colors.danger}
                    cancelColor={colors.secondaryBackground}
                    onRequestClose={() => setConfirmDelete(false)}
                />
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 48,
        marginBottom: 24,
    },
    courseInfo: {
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    courseDetails: {
        gap: 8,
    },
    courseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bullet: {
        fontSize: 16,
        color: '#333',
        width: 10,
    },
    courseText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    courseValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    refundSection: {
        marginBottom: 40,
    },
    refundHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    paymentOption: {
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPaymentOption: {
        borderColor: '#007AFF',
    },
    paymentOptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioContainer: {
        marginRight: 12,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        borderColor: '#007AFF',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 32,
    },
    cardBrand: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1f71',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    cardNumber: {
        fontSize: 14,
        color: '#666',
    },
    accountDescription: {
        fontSize: 14,
        color: '#666',
        marginLeft: 32,
    },
    buttonContainer: {
        gap: 12,
        marginTop: 'auto',
    },
    cancelButton: {
        backgroundColor: colors.secondaryBackground,
    },
    confirmButton: {
        backgroundColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    cancelButton: {
        backgroundColor: '#ff6b35',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});