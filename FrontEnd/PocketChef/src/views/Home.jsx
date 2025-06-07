import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image, Pressable, ScrollView, TextInput} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MainLayout from '../components/MainLayout';
import { Border, Color, FontFamily, FontSize, Gap } from "../GlobalStyles";
import LensIcon from '../../assets/Icons/lens.svg';
import SlidersIcon from '../../assets/Icons/sliders.svg';
import CalendarIcon from '../../assets/Icons/Calendar.svg';
import StarIcon from '../../assets/Icons/Star.svg';
import TimeIcon from '../../assets/Icons/Time.svg';
import VacanciesIcon from '../../assets/Icons/Vacancies.svg';
import { whoAmI } from '../services/users';
import { getLastAddedRecipes, getAllRecipes } from '../services/recipes';
import { getAllCourses } from '../services/courses';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired } from '../utils/jwt';

const Home = ({ navigation }) => {
	const [active, setActive] = useState(0);
	const [lastAddedRecipes, setLastAddedRecipes] = useState([]);
	const [allRecipes, setAllRecipes] = useState([]);
	const [courses, setCourses] = useState([]);
	const [selectedRecipeCategory, setSelectedRecipeCategory] = useState('recientes');
	const [selectedCourseCategory, setSelectedCourseCategory] = useState('recientes');
	const [error, setError] = useState('');
	const [recipeSearch, setRecipeSearch] = useState('');
	const [courseSearch, setCourseSearch] = useState('');

	const { data: user, error: queryError, isLoading } = useQuery({
		queryKey: ['whoAmI'],
		queryFn: async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token || isTokenExpired(token)) {
				navigation?.replace?.('Login');
				throw new Error('No autenticado');
			}
			return whoAmI().then(res => res.data);
		},
		retry: false,
		onError: async (err) => {
			setError(err.response?.data?.message || err.message || 'No autenticado');
			await AsyncStorage.removeItem('token');
			navigation?.replace?.('Login');
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const lastAddedResponse = await getLastAddedRecipes();
				setLastAddedRecipes(lastAddedResponse.data);

				const allRecipesResponse = await getAllRecipes();
				setAllRecipes(allRecipesResponse.data);

				const coursesResponse = await getAllCourses();
				setCourses(coursesResponse.data);
			} catch (error) {
				console.error('Error en la cadena de fetch:', error);
			}
		};
		fetchData();
	}, []);

  	
  	return (
		<MainLayout activeTab={active} onTabPress={setActive}>
			<ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 90}}>
				<View style={styles.background} />
				<LinearGradient style={[styles.gradientBackground, styles.gradientPosition]} locations={[0,1]} colors={['#e9ceaf','#edc45a']} useAngle={true} angle={-65.86} />
				<View style={styles.headerRow}>
					<Text style={styles.greetingText}>
						{user ? `Hola, ${user.nickname} 👋` : "Hola 👋"}
					</Text>
					{user && (
						<Image
							source={user.avatar ? { uri: user.avatar } : require('../../assets/chefcito.png')}
							style={styles.userAvatar}
						/>
					)}
				</View>
				<Text style={styles.kitchenSubtitle}>
					La cocina te espera!
				</Text>
				<View style={styles.rowHeader}>
					<Text style={[styles.recipesHeader, styles.courseHeaderText]}>Recetas</Text>
					<Pressable style={styles.seeMoreButton} onPress={()=>{}}>
						<Text style={styles.seeMoreText}>Ver más</Text>
					</Pressable>
				</View>
				<View style={styles.searchBar}>
					<View style={styles.searchBarBackground} />
					<Pressable style={styles.searchIcon} onPress={()=>{}}>
							<LensIcon />
					</Pressable>
					<View style={styles.searchBarDivider} />
					<Pressable style={styles.filterIcon} onPress={()=>{}}>
							<SlidersIcon />
					</Pressable>
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar..."
						placeholderTextColor={Color.colorGray100}
						value={recipeSearch}
						onChangeText={setRecipeSearch}
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
						{(selectedRecipeCategory === 'recientes' ? lastAddedRecipes : allRecipes).slice(0, 3).map((recipe, idx) => (
							<View key={recipe.id || idx} style={styles.courseCardContainer}>
								<Image
									source={{ uri: recipe.mainPhoto }}
									style={styles.carouselImage}
									resizeMode="cover"
								/>
								<View style={styles.courseOverlay}>
									<Text style={styles.courseTitle} numberOfLines={1}>{recipe.recipeName}</Text>
									<View style={styles.courseOverlayRow}>
										<StarIcon width={15} height={15} />
										<Text style={styles.courseOverlayText}>{recipe.averageRating ?? 0}</Text>
										<TimeIcon width={15.42} height={15.42} style={{ marginLeft: 16 }} />
										<Text style={styles.courseOverlayText}>
											{(recipe.cookingTime ?? 0) + "'"}
										</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</ScrollView>
				<View style={styles.rowHeader}>
					<Text style={[styles.coursesHeader, styles.courseHeaderText]}>Cursos</Text>
					<Pressable style={styles.seeMoreButton} onPress={()=>{}}>
						<Text style={styles.seeMoreText}>Ver más</Text>
					</Pressable>
				</View>
				<View style={styles.searchBar}>
					<View style={styles.searchBarBackground} />
					<Pressable style={styles.searchIcon} onPress={()=>{}}>
						<LensIcon />
					</Pressable>
					<View style={styles.searchBarDivider} />
					<Pressable style={styles.filterIcon} onPress={()=>{}}>
						<SlidersIcon />
					</Pressable>
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar..."
						placeholderTextColor={Color.colorGray100}
						value={courseSearch}
						onChangeText={setCourseSearch}
					/>
				</View>
				<View style={[styles.coursesCategoryRow, styles.categoryRow]}>
					<View style={styles.categoryButton}>
						<Pressable
							style={[
								styles.categoryButton,
								selectedCourseCategory === 'recientes'
									? [styles.selectedCategoryBox, styles.selectedCategory]
									: styles.unselectedCategoryBox
							]}
							onPress={() => setSelectedCourseCategory('recientes')}
						>
							<View style={styles.centeredTextContainer}>
								<Text style={[
									styles.recentCategoryTextSmall,
									styles.categoryTextSmall,
									selectedCourseCategory === 'recientes'
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
								selectedCourseCategory === 'ultimas'
									? [styles.selectedCategoryBox, styles.selectedCategory]
									: styles.unselectedCategoryBox
							]}
							onPress={() => setSelectedCourseCategory('ultimas')}
						>
							<View style={styles.centeredTextContainer}>
								<Text style={[
									styles.lastVacanciesText,
									styles.categoryTextSmall,
									selectedCourseCategory === 'ultimas'
										? { fontWeight: 'bold', color: Color.colorWhite }
										: { color: Color.colorDimgray }
								]}>
									¡Últimas Vacantes!
								</Text>
							</View>
						</Pressable>
					</View>
				</View>
				<ScrollView style={[styles.coursesCarousel, styles.carouselContainer]} horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.carouselRow}>
						{courses.slice(0, 3).map((course, idx) => (
							<View key={course.id || idx} style={styles.courseCardContainer}>
								<Image
									source={{ uri: course.coursePhoto }}
									style={styles.carouselImage}
									resizeMode="cover"
								/>
								<View style={styles.courseOverlay}>
									<Text style={styles.courseTitle} numberOfLines={1}>{course.description}</Text>
									<View style={styles.courseOverlayRow}>
										<VacanciesIcon width={15} height={15} />
										<Text style={styles.courseOverlayText}>
											{course.courseSchedules && course.courseSchedules.length > 0 && typeof course.courseSchedules[0].availableSlots !== 'undefined'
												? course.courseSchedules[0].availableSlots
												: 25}
										</Text>
										<CalendarIcon width={15.42} height={15.42} style={{ marginLeft: 16 }} />
										<Text style={styles.courseOverlayText}>
											{course.courseSchedules && course.courseSchedules.length > 0 && course.courseSchedules[0].startDate
												? (() => {
													const d = new Date(course.courseSchedules[0].startDate);
													return `${d.getMonth() + 1}/${d.getDate()}`;
												})()
												: 'MM/DD'}
										</Text>
									</View>
								</View>
							</View>
						))}
					</View>
				</ScrollView>
			</ScrollView>
		</MainLayout>
  	);
};


const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#fff',
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
		height: 26,
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
		height: 26,
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
		height: 135,
		backgroundColor: "transparent",
		boxShadow: "0px 6px 20px " + Color.colorGray200,
		borderRadius: Border.br_20,
		width: 411
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
    	height: 24,
    	fontFamily: FontFamily.interMedium,
    	fontWeight: "500",
    	color: Color.colorDimgray,
    	alignItems: "center",
    	display: "flex",
    	textAlign: "left",
    	lineHeight: 13,
    	marginTop: -2,
    	marginLeft: 27,
  	},
  	searchBarBackground: {
    	borderRadius: 10,
    	backgroundColor: Color.colorGainsboro200,
    	borderWidth: 1,
    	borderColor: Color.colorGray100,
    	borderStyle: "solid",
    	width: 358,
    	height: 45,
    	left: 0,
    	top: 0,
    	position: "absolute"
  	},
  	searchIcon: {
    	left: 16,
    	top: "50%",
    	width: 24,
    	height: 24,
    	marginTop: -14,
    	position: "absolute"
  	},
  	searchBarDivider: {
    	left: 307,
    	borderRightWidth: 1,
    	width: 1,
    	height: 32,
    	top: "50%",
    	marginTop: -19,
    	borderColor: Color.colorGray100,
    	borderStyle: "solid",
    	position: "absolute"
  	},
  	filterIcon: {
    	left: 315,
    	width: 24,
    	top: "50%",
    	height: 24,
    	marginTop: -15,
    	position: "absolute"
  	},
  	searchInput: {
		left: 44,
		color: Color.colorGray100,
		width: 250,
		height: 45,
		letterSpacing: 0.5,
		fontSize: FontSize.size_16,
		top: "50%",
		marginTop: -26,
		fontFamily: FontFamily.interMedium,
		fontWeight: "500",
		alignItems: "center",
		display: "flex",
		textAlign: "left",
		position: "absolute",
		padding: 0,
		backgroundColor: 'transparent',
	},
  	searchBar: {
    	width: 358,
    	height: 52,
    	alignSelf: "center",
    	marginTop: 24,
    	marginBottom: 16,
  	},
  	recipesHeader: {
		marginLeft: 32,
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
    	marginBottom: 32,
  	},
  	coursesHeader: {
		marginLeft: 32,
	},
	rowHeader: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		marginTop: 32,
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
		backgroundColor: "#eee",
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
});

export default Home;
