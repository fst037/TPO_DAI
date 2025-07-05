import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarPintada from "../../assets/StarPintada";
import StarNoPintada from "../../assets/StarNoPintada";
import AlertModal from '../components/global/modals/AlertModal';
import { addRatingToRecipe } from '../services/recipes';
import { whoAmI } from '../services/users';

export default function PostReview({ route, navigation }) {
    const { recipeData } = route.params || {};
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

    // Validar que recipeData existe
    if (!recipeData) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: No se encontraron datos de la receta</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack({ id: recipeData.id })}
                    >
                        <Text style={styles.backButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleStarPress = (starIndex) => {
        setRating(starIndex);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            setAlert({ visible: true, title: 'Error', message: 'Por favor selecciona una calificación' });
            return;
        }

        if (comment.trim().length === 0) {
            setAlert({ visible: true, title: 'Error', message: 'Por favor escribe un comentario' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Verificar autenticación dentro del handleSubmitReview
            const userResponse = await whoAmI();
            const user = userResponse.data;
            
            const reviewData = {
                rating: rating,
                comments: comment.trim()
            };

            console.log('ID de la receta:', recipeData.id);
            console.log('Enviando reseña:', reviewData);
            console.log('Usuario autenticado:', user?.nickname || 'Usuario desconocido');
            
            const response = await addRatingToRecipe(recipeData.id, reviewData);
            console.log('Respuesta recibida:', response);
            
            setAlert({ 
              visible: true, 
              title: 'Éxito', 
              message: 'Tu reseña ha sido enviada correctamente',
              onClose: () => navigation.goBack({ id: recipeData.id })
            });

        } catch (err) {
            console.error('Error al enviar reseña:', err);
            console.error('Respuesta del error:', err.response);
            console.error('Datos del error:', err.response?.data);
            console.error('Estado del error:', err.response?.status);
            
            let errorMsg = 'Ocurrió un error inesperado.';
            
            if (err.response?.status === 401) {
                await AsyncStorage.removeItem('token');
                navigation.replace('Login', {
                    returnScreen: 'PostReview',
                    returnParams: { recipeData }
                });
                return;
            } else if (err.response?.status === 400) {
                errorMsg = 'Datos de la reseña inválidos.';
            } else if (err.response?.status === 404) {
                errorMsg = 'Receta no encontrada.';
            } else if (err.response?.status === 403) {
                errorMsg = 'No tienes permisos para dejar una reseña en esta receta.';
            } else {
                if (typeof err.response?.data === 'string') {
                  const match = err.response.data.match(/"([^"]+)"$/);
                  errorMsg = match ? match[1] : err.response.data;
                }
            }
            
            setAlert({ visible: true, title: 'Error', message: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const StarRating = () => {
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarPress(i)}
                    style={styles.starButton}
                >
                    {i <= rating ? (
                        <StarPintada width={35} height={35} />
                    ) : (
                        <StarNoPintada width={35} height={35} />
                    )}
                </TouchableOpacity>
            );
        }
        
        return <View style={styles.starContainer}>{stars}</View>;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.title}>Dejar una reseña</Text>

                {/* Recipe Info */}
                <View style={styles.recipeInfo}>
                    <Image
                        source={{ 
                            uri: recipeData.mainPhoto || 'https://via.placeholder.com/80x80?text=Recipe' 
                        }}
                        style={styles.recipeImage}
                    />
                    <View style={styles.recipeDetails}>
                        <Text style={styles.recipeName}>
                            {recipeData.recipeName || 'Receta sin nombre'}
                        </Text>
                        <Text style={styles.recipeCategory}>
                            {recipeData.recipeType?.description || 'Sin categoría'}
                        </Text>
                        <Text style={styles.recipeAuthor}>
                            {(recipeData.cookingTime || '0')} min • de {recipeData.user?.nickname || 'Usuario anónimo'}
                        </Text>
                    </View>
                </View>

                {/* Rating Section */}
                <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>Tu puntaje</Text>
                    <StarRating />
                </View>

                {/* Comment Section */}
                <View style={styles.commentSection}>
                    <Text style={styles.commentLabel}>Añade una reseña</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Escribe aquí"
                        placeholderTextColor="#999"
                        multiline
                        value={comment}
                        onChangeText={setComment}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>

            {/* Buttons - Fixed at bottom */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack({ id: recipeData.id })}
                    disabled={isSubmitting}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmitReview}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? "Enviando..." : "Dejar reseña"}
                    </Text>
                </TouchableOpacity>
            </View>

            <AlertModal
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                onClose={() => {
                    setAlert({ ...alert, visible: false });
                    // Si hay un callback específico para cuando se cierra el alert de éxito
                    if (alert.onClose) {
                        alert.onClose();
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    recipeInfo: {
        flexDirection: 'row',
        marginBottom: 32,
        alignItems: 'center',
    },
    recipeImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginRight: 16,
    },
    recipeDetails: {
        flex: 1,
    },
    recipeName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    recipeCategory: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    recipeAuthor: {
        fontSize: 16,
        color: '#666',
    },
    ratingSection: {
        marginBottom: 32,
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 12,
        alignSelf: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    starButton: {
        padding: 4,
        marginHorizontal: 5,
    },
    commentSection: {
        marginBottom: 32,
    },
    commentLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        minHeight: 150,
        color: '#333',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: 40,
        flexDirection: 'row',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FF6B35',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#FF6B35',
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#FF6B35',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 30,
    },
    submitButtonDisabled: {
        backgroundColor: '#ffb299',
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorText: {
        fontSize: 18,
        color: '#FF6B35',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    backButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FF6B35',
        marginTop: 10,
    },
    backButtonText: {
        color: '#FF6B35',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
});