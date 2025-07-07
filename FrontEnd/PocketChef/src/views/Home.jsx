import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image, Pressable, ScrollView, TextInput, Alert} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import NetInfo from '@react-native-community/netinfo';
import { MaterialIcons } from '@expo/vector-icons';
import { Border, Color, FontFamily, FontSize, Gap } from "../GlobalStyles";
import colors from '../theme/colors';
import CalendarIcon from '../../assets/Icons/Calendar.svg';
import StarIcon from '../../assets/Icons/Star.svg';
import { whoAmI } from '../services/users';
import { getLastAddedRecipes, getAllRecipes } from '../services/recipes';
import { getAllCourses } from '../services/courses';
import { getDownloadedRecipes } from '../services/downloads';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired } from '../utils/jwt';
import { useFocusEffect } from '@react-navigation/native';
import RecipeSearchBar from '../components/recipe/RecipeSearchBar';
import CourseSearchBar from '../components/course/CourseSearchBar';
import RecipeOfflineCard from '../components/recipe/RecipeOfflineCard';

const Home = ({ navigation }) => {
	const [active, setActive] = useState(0);
	const [lastAddedRecipes, setLastAddedRecipes] = useState([]);
	const [allRecipes, setAllRecipes] = useState([]);
	const [courses, setCourses] = useState([]);
	const [selectedRecipeCategory, setSelectedRecipeCategory] = useState('recientes');
	const [selectedCourseCategory, setSelectedCourseCategory] = useState('recientes');
	const [isConnected, setIsConnected] = useState(true);
	const [offlineRecipes, setOfflineRecipes] = useState([]);
	const [hasShownOfflineAlert, setHasShownOfflineAlert] = useState(false);

	const { data: user, isLoading } = useQuery({
		queryKey: ['whoAmI'],
		queryFn: async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token || isTokenExpired(token)) return null; 
			return whoAmI().then(res => res.data);
		},
		retry: false,
	});

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Network connection listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!state.isConnected;
      setIsConnected(connected);
      
      // Show offline alert only once when going offline
      if (!connected && !hasShownOfflineAlert) {
        setHasShownOfflineAlert(true);
        Alert.alert(
          'Sin conexión a Internet',
          'No tienes conexión a Internet. Solo podrás ver las recetas que hayas descargado previamente. Las demás funciones no estarán disponibles.',
          [{ text: 'Entendido', onPress: () => {} }]
        );
      } else if (connected) {
        // Reset the alert flag when connection is restored
        setHasShownOfflineAlert(false);
      }
    });
    return () => unsubscribe();
  }, [hasShownOfflineAlert]);

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      };
      
      const refreshOfflineRecipes = async () => {
        try {
          const offline = await getDownloadedRecipes();
          setOfflineRecipes(offline);
        } catch (error) {
          console.error('Error refreshing offline recipes:', error);
        }
      };
      
      checkToken();
      refreshOfflineRecipes();
    }, [])
  );

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Always try to get offline recipes
				const offline = await getDownloadedRecipes();
				setOfflineRecipes(offline);

				// Only fetch online data if connected
				if (isConnected) {
					const lastAddedResponse = await getLastAddedRecipes();
					setLastAddedRecipes(lastAddedResponse.data);

					const allRecipesResponse = await getAllRecipes();
					setAllRecipes(allRecipesResponse.data);

					const coursesResponse = await getAllCourses();
					setCourses(coursesResponse.data);
				}
			} catch (error) {
				console.error('Error en la cadena de fetch:', error.response?.data);
				// If online fetch fails, ensure we still have offline recipes
				try {
					const offline = await getDownloadedRecipes();
					setOfflineRecipes(offline);
				} catch (offlineError) {
					console.error('Error fetching offline recipes:', offlineError);
				}
			}
		};
		fetchData();
	}, [isConnected]);

  const handleFilterRecipes = async (filterObj) => {    
    navigation.navigate('Recipes', {initialFilters: filterObj});
  }

  const handleFilterCourses = async (filterObj) => {    
    navigation.navigate('Courses', {initialFilters: filterObj});
  }

  // Refresh offline recipes after delete
  const handleOfflineDeleted = async () => {
    try {
      const offline = await getDownloadedRecipes();
      setOfflineRecipes(offline);
    } catch (error) {
      console.error('Error refreshing offline recipes:', error);
    }
  };
  	
  	return (
		<View flex={1} style={{backgroundColor: Color.white}}>
			<ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 30}}>
				<View style={styles.background} />
				<LinearGradient style={[styles.gradientBackground, styles.gradientPosition]} locations={[0,1]} colors={[colors.secondaryBackground,colors.secondary]} useAngle={true} angle={-65.86} />
				<View style={styles.headerRow}>
					<Text
						style={[
							styles.greetingText,
							!isAuthenticated && { width: '100%', textAlign: 'center', alignSelf: 'center' }
						]}
					>
						{!isConnected 
							? "📱 Modo sin conexión" 
							: (isAuthenticated && user?.nickname ? `Hola, ${user?.nickname} 👋` : "Bienvenido!")
						}
					</Text>
					{isAuthenticated && user && isConnected && (
						<Pressable onPress={() => {
							navigation.navigate('Profile');
						}}>
							<Image
								source={user.avatar ? { uri: user.avatar } : require('../../assets/chefcito.png')}
								style={styles.userAvatar}
							/>
						</Pressable>
					)}
				</View>
				<Text
					style={[
						styles.kitchenSubtitle,
						!isAuthenticated && { width: '100%', textAlign: 'center', alignSelf: 'center', marginTop: 8 }
					]}
				>
					{!isConnected 
						? "Tus recetas descargadas te esperan!"
						: "La cocina te espera!"
					}
				</Text>

				{!isConnected ? (
					// Offline Mode - Show downloaded recipes only
					<>
						
						{offlineRecipes.length === 0 ? (
							<View style={styles.emptyOfflineContainer}>
								<Text style={styles.emptyOfflineText}>
									No tienes recetas descargadas. Cuando tengas conexión a Internet, puedes descargar recetas para verlas sin conexión.
								</Text>
							</View>
						) : (
							<View style={styles.offlineRecipesList}>
								{offlineRecipes.map((recipe, idx) => (
									<View key={`offline-${recipe.id || idx}`} style={styles.offlineRecipeItem}>
										<RecipeOfflineCard
											recipe={recipe}
											onPress={() => navigation.navigate('RecipeOffline', { recipeId: recipe.id })}
											onDeleted={handleOfflineDeleted}
										/>
									</View>
								))}
							</View>
						)}
					</>
				) : (
          // Online Mode - Show regular content
          <>
            <View style={[styles.rowHeader, { marginTop: 60 }]}>
              <Text style={[styles.recipesHeader, styles.courseHeaderText]}>Recetas</Text>
              <Pressable style={styles.seeMoreButton} onPress={()=>{navigation.navigate('Recipes')}}>
								<Text style={styles.seeMoreText}>Ver más</Text>
							</Pressable>
						</View>
						<View style={{marginHorizontal: 24, marginTop: 16}}>
							<RecipeSearchBar
								onSearch={handleFilterRecipes}
							/>
						</View>
				<View style={[styles.recipesCategoryRow, styles.categoryRow]}>
					<View style={styles.categoryButton}>
						<Pressable
							style={[
								styles.categoryButton,
								selectedRecipeCategory === 'recientes'
									? [styles.selectedCategoryBox, styles.selectedCategory]
									: styles.unselectedCategoryBox
							]}
							onPress={() => setSelectedRecipeCategory('recientes')}
						>
							<View style={styles.centeredTextContainer}>
								<Text style={[
									styles.recentCategoryText,
									styles.categoryText,
									selectedRecipeCategory === 'recientes'
										? { fontWeight: 'bold', color: Color.colorWhite }
										: { color: Color.colorDimgray }
								]}>
									Recientes
								</Text>
							</View>
						</Pressable>
					</View>
					<View style={styles.categoryButton}>
						<Pressable
							style={[
								styles.categoryButton,
								selectedRecipeCategory === 'populares'
									? [styles.selectedCategoryBox, styles.selectedCategory]
									: styles.unselectedCategoryBox
							]}
							onPress={() => setSelectedRecipeCategory('populares')}
						>
							<View style={styles.centeredTextContainer}>
								<Text style={[
									styles.popularCategoryText,
									styles.categoryText,
									selectedRecipeCategory === 'populares'
										? { fontWeight: 'bold', color: Color.colorWhite }
										: { color: Color.colorDimgray }
								]}>
									Populares
								</Text>
							</View>
						</Pressable>
					</View>
				</View>
				<ScrollView style={[styles.recipesCarousel, styles.carouselContainer]} horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.carouselRow}>
						{Array.isArray(selectedRecipeCategory === 'recientes' ? lastAddedRecipes : allRecipes)
							? (selectedRecipeCategory === 'recientes' ? lastAddedRecipes : allRecipes).slice(0, 3).map((recipe, idx) => (
								<View key={recipe.id || idx} style={styles.courseCardContainer}>
									<Pressable
										onPress={() => navigation.navigate('Recipe', { id: recipe.id })}
									>
										<Image
											source={{ uri: recipe.mainPhoto }}
											style={styles.carouselImage}
											resizeMode="cover"
										/>
									</Pressable>
									<View style={styles.courseOverlay}>
										<Text style={styles.courseTitle} numberOfLines={1}>{recipe.recipeName}</Text>
										<View style={styles.courseOverlayRow}>
											<StarIcon width={15} height={15} />
											<Text style={styles.courseOverlayText}>{recipe.averageRating ?? 0}</Text>
											<MaterialIcons name="access-time" size={15} color="#fff" style={{ marginLeft: 16 }} />
											<Text style={styles.courseOverlayText}>
												{(recipe.cookingTime ?? 0) + "'"}
											</Text>
										</View>
									</View>
								</View>
							))
							: null}
					</View>
				</ScrollView>
				<View style={styles.rowHeader}>
					<Text style={[styles.coursesHeader, styles.courseHeaderText]}>Cursos</Text>
					<Pressable style={styles.seeMoreButton} onPress={()=>{navigation.navigate('Courses')}}>
						<Text style={styles.seeMoreText}>Ver más</Text>
					</Pressable>
				</View>
				<View style={{marginHorizontal: 24, marginTop: 16}}>
					<CourseSearchBar
						onSearch={handleFilterCourses}
					/>
				</View>
				<ScrollView style={[styles.coursesCarousel, styles.carouselContainer]} horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.carouselRow}>
						{Array.isArray(courses)
							? courses.slice(0, 3).map((course, idx) => (
								<View key={course.id || idx} style={styles.courseCardContainer}>
									<Pressable
										onPress={() => {
											if (isAuthenticated) {
												navigation.navigate('Curso', { id: course.id });
											} else {
												navigation.navigate('Login');
											}
										}}
									>
										<Image
											source={{ uri: course.coursePhoto }}
											style={styles.carouselImage}
											resizeMode="cover"
										/>
									</Pressable>
									<View style={styles.courseOverlay}>
										<Text style={styles.courseTitle} numberOfLines={1}>{course.description}</Text>
										<View style={styles.courseOverlayRow}>
											<MaterialIcons name="access-time" size={15} color="#fff" />
											<Text style={styles.courseOverlayText}>
												{course.duration || 0}h
											</Text>
											<MaterialIcons name="attach-money" size={15} color="#fff" style={{ marginLeft: 16 }} />
											<Text style={styles.courseOverlayText}>
												${course.price?.toLocaleString() || '0'}
											</Text>
										</View>
									</View>
								</View>
							))
							: null}
					</View>
				</ScrollView>
					</>
				)}
			</ScrollView>
		</View>
  	);
};


const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: colors.background,
	},
  	gradientPosition: {
    	borderRadius: Border.br_20,
    	left: 0,
    	top: 0,
    	position: "absolute"
  	},
  	courseHeaderText: {
		width: 160,
		color: Color.colorDarkslategray,
		fontFamily: "Poppins-SemiBold",
		letterSpacing: 0.5,
		fontSize: 20,
		textAlign: "left",
		fontWeight: "600"
	},
  	seeMoreText: {
    	width: 80,
    	textAlign: "right",
    	fontFamily: FontFamily.robotoBold,
    	letterSpacing: 0.5,
    	fontSize: FontSize.size_16,
    	color: Color.colorDimgray,
    	fontWeight: "600"
  	},
  	categoryRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: Gap.gap_12,
		width: '100%',
	},
  	categoryText: {
		width: 138,
		textAlign: "center",
		letterSpacing: 0.4,
		fontSize: FontSize.size_14,
		justifyContent: "center",
		fontFamily: FontFamily.robotoBold,
		alignItems: "center",
		display: "flex",
		fontWeight: "600",
	},
  	categoryButton: {
		height: 55,
		width: 165,
		position: "relative",
  	},
  	carouselContainer: {
    	maxWidth: 353,
    	width: 353,
    	flex: 1
  	},
  	categoryTextSmall: {
		width: 136,
		textAlign: "center",
		letterSpacing: 0.4,
		fontSize: FontSize.size_14,
		justifyContent: "center",
		fontFamily: FontFamily.robotoBold,
		alignItems: "center",
		display: "flex",
		fontWeight: "600",
	},
  	background: {
    	backgroundColor: Color.colorWhite
  	},
  	gradientBackground: {
		height: 150,
		backgroundColor: "transparent",
		boxShadow: "0px 6px 20px " + Color.colorGray200,
		borderRadius: Border.br_20,
		width: '100%'
  	},
  	headerRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginTop: 50,
		marginLeft: 27,
		marginRight: 27,
	},
	userAvatar: {
		width: 48,
		height: 48,
		borderRadius: 22,
		backgroundColor: '#eee',
		marginTop: 6,
		marginRight: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.28,
		shadowRadius: 8,
		elevation: 8,
	},
  	greetingText: {
    	fontSize: 30,
    	letterSpacing: 0.9,
    	fontFamily: FontFamily.montserratSemiBold,
    	color: Color.colorBlack,
    	height: 40,
    	alignItems: "center",
    	display: "flex",
    	textAlign: "left",
    	fontWeight: "600",
    	lineHeight: 40,
  	},
  	kitchenSubtitle: {
    	fontSize: 20,
    	letterSpacing: 0.6,
    	fontFamily: FontFamily.interMedium,
    	fontWeight: "500",
    	color: Color.colorDimgray,
    	alignItems: "center",
    	display: "flex",
    	textAlign: "left",
    	marginLeft: 27,
  	},
  	recipesHeader: {
		marginLeft: 32,
    marginTop: 20,
	},
  	selectedCategoryBox: {
		backgroundColor: Color.colorGoldenrod,
		height: 55,
		width: 165,
		borderRadius: 24,
		boxShadow: "0px 6px 12.3px " + Color.colorGray200,
	},
  	recentCategoryText: {
    	color: Color.colorWhite
  	},
  	unselectedCategoryBox: {
		backgroundColor: Color.colorGainsboro100,
		borderRadius: 24,
	},
  	popularCategoryText: {
    	color: Color.colorDimgray
  	},
  	recipesCategoryRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 0,
		marginBottom: 16,
		gap: Gap.gap_12,
	},
  	recipesCarousel: {
    	marginTop: 4,
    	marginLeft: 32,
  	},
  	coursesCarousel: {
    	marginTop: 12,
    	marginLeft: 32,
  	},
  	coursesHeader: {
		marginLeft: 32,
	},
	rowHeader: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		marginTop: 20,
		marginBottom: 0,
	},
	seeMoreButton: {
		marginLeft: 'auto',
		marginRight: 32,
	},
  	recentCategoryTextSmall: {
    	color: Color.colorWhite
  	},
  	lastVacanciesText: {
    	color: Color.colorDimgray
  	},
  	coursesCategoryRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
		marginBottom: 16,
		gap: Gap.gap_12,
  	},
  	carouselRow: {
		flexDirection: "row",
	},
	carouselImage: {
		width: 203,
		height: 320,
		borderRadius: 20,
		marginRight: 28,
		backgroundColor: colors.secondaryBackground,
	},
	container: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	centeredTextContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	selectedCategory: {
		backgroundColor: Color.colorGoldenrod,
	},
	unselectedCategory: {
		backgroundColor: Color.colorGainsboro100,
	},
	courseCardContainer: {
		position: 'relative',
	},
	courseOverlay: {
		position: 'absolute',
		bottom: 18,
		left: 12,
		width: '78%',
		backgroundColor: 'rgba(30,30,30,0.85)',
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 10,
	},
	courseTitle: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	courseOverlayRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	courseOverlayText: {
		color: '#fff',
		fontSize: 14,
		marginLeft: 0,
		marginRight: 8,
	},
	emptyOfflineContainer: {
		marginHorizontal: 32,
		marginTop: 60,
		padding: 24,
		backgroundColor: colors.secondaryBackground,
		borderRadius: 12,
		alignItems: 'center',
	},
	emptyOfflineText: {
		color: colors.mutedText,
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 24,
	},
	offlineRecipesList: {
		marginHorizontal: 32,
		marginTop: 60,
	},
	offlineRecipeItem: {
		marginBottom: 16,
	},
});

export default Home;
