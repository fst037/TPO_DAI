import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import RatingList from "../components/RatingList";
import StarPintada from "../../assets/StarPintada";
import StarNoPintada from "../../assets/StarNoPintada";
import DropdownSelector from '../components/DropdownSelector';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { whoAmI } from '../services/users';
import { isTokenExpired } from '../utils/jwt';
import { getRecipeById } from '../services/recipes';

export default function SeeReviews({ route }) {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { receta, id } = route.params;
    
    // Estado para el filtro seleccionado
    const [selectedFilter, setSelectedFilter] = useState("Todas");
    
    // Hook para invalidar queries cuando la pantalla recibe el foco
    useFocusEffect(
        useCallback(() => {
            // Invalidar las queries para forzar refetch de datos actualizados
            queryClient.invalidateQueries({ queryKey: ['recipe', id] });
            
            // Si también quieres refrescar los datos del usuario
            // queryClient.invalidateQueries({ queryKey: ['whoAmI'] });
        }, [queryClient, id])
    );
    
    // Usar useQuery para manejar la autenticación - se ejecuta automáticamente al cargar
    const { data: user, error: authError, isLoading: isAuthLoading } = useQuery({
        queryKey: ['whoAmI'],
        queryFn: async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token || isTokenExpired(token)) {
                navigation.replace('Login', {
                    returnScreen: 'SeeReviews',
                    returnParams: { receta, id }
                });
                throw new Error('No autenticado');
            }
            return whoAmI().then(res => res.data);
        },
        retry: false,
        onError: async (err) => {
            await AsyncStorage.removeItem('token');
            navigation.replace('Login', {
                returnScreen: 'SeeReviews',
                returnParams: { receta, id }
            });
        },
    });

    // Query para obtener la receta por ID (solo si se proporciona id)
    const { data: fetchedRecipe, error: recipeError, isLoading: isRecipeLoading } = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(id).then(res => res.data),
        enabled: !!id && !!user, // Solo ejecutar si hay id y usuario autenticado
        retry: false,
        onError: (err) => {
            console.error('Error al obtener receta:', err);
            Alert.alert('Error', 'No se pudo cargar la receta');
        }
    });
    
    // Determinar qué datos usar
    const actualRecipeData = id ? fetchedRecipe : receta;
    const actualRatings = actualRecipeData?.ratings || [];
    
    // Opciones del filtro
    const filterOptions = [
        "Todas",
        "5 estrellas",
        "4 estrellas", 
        "3 estrellas",
        "2 estrellas",
        "1 estrella"
    ];
    
    // Manejo seguro de datos
    const hasRatings = actualRatings && actualRatings.length > 0;
    const averageRating = actualRecipeData?.averageRating || 0;
    const totalComments = actualRatings.length;
    const recipe = actualRecipeData;

    // Filtrar ratings según la selección
    const filteredRatings = useMemo(() => {
        if (!hasRatings) return [];
        
        if (selectedFilter === "Todas") {
            return actualRatings;
        }
        
        // Extraer el número de estrellas del filtro seleccionado
        const starCount = parseInt(selectedFilter.split(" ")[0]);
        
        return actualRatings.filter(rating => rating.rating === starCount);
    }, [actualRatings, selectedFilter, hasRatings]);

    const StarRating = ({ rating }) => {
        const stars = [];
        const roundedRating = Math.round(rating);
    
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= roundedRating ? (
                    <StarPintada key={i} width={25} height={25} style={styles.star} />
                ) : (
                    <StarNoPintada key={i} width={25} height={25} style={styles.star} />
                )
            );
        }
    
        return <View style={styles.starRow}>{stars}</View>;
    };

    const handleFilterSelect = (option) => {
        setSelectedFilter(option);
    };

    const handleLeaveReview = () => {
        if (recipe) {
            navigation.navigate('PostReview', { 
                recipeData: recipe 
            });
        } else {
            Alert.alert('Error', 'No se encontraron datos de la receta');
        }
    };

    // Estados de loading y error
    const isLoading = isAuthLoading || (id && isRecipeLoading);
    const hasError = authError || (id && recipeError);

    // Mostrar loading mientras verifica autenticación o carga receta
    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                        {isAuthLoading ? 'Verificando sesión...' : 'Cargando receta...'}
                    </Text>
                </View>
            </View>
        );
    }

    // Si hay error de autenticación, no renderizar nada (ya se redirigió al login)
    if (authError) {
        return null;
    }

    // Si hay error de receta o no se encontraron datos
    if ((id && recipeError) || (!id && !receta) || (!actualRecipeData)) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {id && recipeError ? 'Error al cargar la receta' : 'No se encontraron datos de la receta'}
                    </Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con rating principal */}
            <View style={styles.ratingHeader}>
                <Text style={styles.ratingNumber}>
                    {averageRating.toFixed(1)}
                </Text>
                
                <View style={styles.ratingDetails}>
                    <StarRating rating={averageRating} />
                    <Text style={styles.reviewCount}>
                        ({totalComments} reseñas)
                    </Text>
                </View>
            </View>

            {/* Contenido condicional basado en si hay ratings */}
            {hasRatings ? (
                <>
                    {/* Dropdown para filtrar por estrellas */}
                    <View style={styles.filterContainer}>
                        <DropdownSelector
                            options={filterOptions}
                            onSelect={handleFilterSelect}
                            selectedOption={selectedFilter}
                            placeholder="Elegir estrellas"
                        />
                    </View>

                    {/* Lista de ratings filtrados */}
                    <RatingList ratings={filteredRatings} showDeleteButton={false} />
                </>
            ) : (
                /* Mensaje cuando no hay reseñas */
                <View style={styles.noReviewsContainer}>
                    <Text style={styles.noReviewsText}>Sin reseñas</Text>
                    <Text style={styles.noReviewsSubtext}>
                        Sé el primero en dejar una reseña para esta receta
                    </Text>
                </View>
            )}
            
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title="Dejar reseña"
                    onPress={handleLeaveReview}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    ratingHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 16,
        marginTop: 50,
    },
    ratingNumber: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    ratingDetails: {
        alignItems: 'center',
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    star: {
        marginHorizontal: 2,
    },
    reviewCount: {
        fontSize: 20,
        color: '#666',
        fontWeight: '500',
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    buttonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
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
    noReviewsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    noReviewsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    noReviewsSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
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
    },
    backButtonText: {
        color: '#FF6B35',
        fontSize: 16,
        fontWeight: '600',
    },
});