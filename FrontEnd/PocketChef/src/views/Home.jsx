import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image, Pressable, ScrollView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {SafeAreaView} from "react-native-safe-area-context";
import MainLayout from '../components/MainLayout';
import { Border, Color, FontFamily, FontSize, Gap } from "../GlobalStyles";
import LensIcon from '../../assets/Icons/lens.svg';
import SlidersIcon from '../../assets/Icons/sliders.svg';

const Home = () => {

	const [active, setActive] = useState(0);
	const [user, setUser] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		fetch('http://192.168.0.229:4002/api/v1/auth/authenticate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: "mariarodriguez@gmail.com",
				password: "123456"
			})
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Respuesta de red no OK');
			}
			return response.json();
		})
		.then(data => {
			console.log('Respuesta autenticación:', data);
			setUser(data);

			const token = data.access_token;
			console.log('Token recibido:', token);

			return fetch('http://192.168.0.229:4002/recipes/', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Respuesta de red no OK');
			}
			return response.json();
		})
		.then(data => {
			console.log('Datos recibidos:', data);
			setRecipes(data);
		})
		.catch(error => {
			console.error('Error en la cadena de fetch:', error);
		});
	}, []);

  	
  	return (
		<MainLayout activeTab={active} onTabPress={setActive}>
			<ScrollView style={styles.scrollContainer} contentContainerStyle={{paddingBottom: 90}}>
				<View style={styles.background} />
				<LinearGradient style={[styles.scrollChild, styles.groupItemPosition]} locations={[0,1]} colors={['#e9ceaf','#edc45a']} useAngle={true} angle={-65.86} />
				<Text style={styles.holaMara}>{`Bienvenido!`}</Text>
				<Text style={styles.laCocinaTe}>La cocina te espera!</Text>

				{/* Agrupar Recetas y Ver más en una fila */}
				<View style={styles.rowHeader}>
					<Text style={[styles.recetas, styles.cursosTypo]}>Recetas</Text>
					<Pressable style={styles.verMsCursos} onPress={()=>{}}>
						<Text style={styles.verTypo}>Ver más</Text>
					</Pressable>
				</View>
				{/* Fin de la fila Recetas/Ver más */}

				<View style={styles.searchBar}>
					<View style={styles.searchBarChild} />

					<Pressable style={styles.lens} onPress={()=>{}}>
							<LensIcon />
					</Pressable>

					<View style={styles.searchBarItem} />

					<Pressable style={styles.sliders} onPress={()=>{}}>
							<SlidersIcon />
					</Pressable>

					<Text style={styles.buscar}>Buscar...</Text>
				</View>

				<View style={[styles.categorasRecetas, styles.categorasFlexBox]}>
					<View style={styles.groupItemLayout}>
						<View style={styles.groupShadowBox} />
						<View style={styles.centeredTextContainer}>
							<Text style={[styles.recientes, styles.recientesTypo]}>Recientes</Text>
						</View>
					</View>
					<View style={styles.groupItemLayout}>
						<View style={[styles.groupItem, styles.groupItemLayout]} />
						<View style={styles.centeredTextContainer}>
							<Text style={[styles.populares, styles.recientesTypo]}>Populares</Text>
						</View>
					</View>
					
				</View>

				<ScrollView style={[styles.carousellRecetas, styles.carousellLayout]} horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.carouselRow}>
						{recipes.slice(0, 3).map((recipe, idx) => (
							<Image
								key={recipe.id || idx}
								source={{ uri: recipe.mainPhoto }}
								style={styles.carouselImage}
								resizeMode="cover"
							/>
						))}
					</View>
				</ScrollView>

				{/* Agrupar Cursos y Ver más en una fila */}
				<View style={styles.rowHeader}>
					<Text style={[styles.cursos, styles.cursosTypo]}>Cursos</Text>
					<Pressable style={styles.verMsCursos} onPress={()=>{}}>
						<Text style={styles.verTypo}>Ver más</Text>
					</Pressable>
				</View>

				{/* Buscador debajo de "Cursos" */}
				<View style={styles.searchBar}>
					<View style={styles.searchBarChild} />

					<Pressable style={styles.lens} onPress={()=>{}}>
						{/*<Image style={[styles.icon, styles.iconLayout1]} resizeMode="cover" source={require("../assets/Lens.png")} />*/}
						<LensIcon />
					</Pressable>

					<View style={styles.searchBarItem} />

					<Pressable style={styles.sliders} onPress={()=>{}}>
						{/*<Image style={[styles.icon1, styles.iconLayout1]} resizeMode="cover" source={require("../assets/sliders.png")} />*/}
						<SlidersIcon />
					</Pressable>

					<Text style={styles.buscar}>Buscar...</Text>
				</View>
				{/* Fin buscador cursos */}

				<View style={[styles.categorasCursos, styles.categorasFlexBox]}>
					<View style={styles.groupItemLayout}>
						<View style={styles.groupShadowBox} />
						<View style={styles.centeredTextContainer}>
							<Text style={[styles.recientes1, styles.recientes1Position]}>Recientes</Text>
						</View>
					</View>
					<View style={styles.groupItemLayout}>
						<View style={[styles.groupItem, styles.groupItemLayout]} />
						<View style={styles.centeredTextContainer}>
							<Text style={[styles.ltimasVacantes, styles.recientes1Position]}>¡Últimas Vacantes!</Text>
						</View>
					</View>
				</View>

				<ScrollView style={[styles.carousellCursos, styles.carousellLayout]} horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.carouselRow}>
						<Pressable style={[styles.carbonaraIcon, styles.iconLayout]} onPress={()=>{}}>
								{/*<Image style={[styles.icon2, styles.iconLayout1]} resizeMode="cover" source={require("../assets/Vikingo.png")} />*/}
						</Pressable>
						{recipes.slice(0, 3).map((recipe, idx) => (
							<Image
								key={recipe.id || idx}
								source={{ uri: "data:image/jpeg;base64,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" }}
								style={styles.carouselImage}
								resizeMode="cover"
							/>
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
  	groupItemPosition: {
    		borderRadius: Border.br_20,
    		left: 0,
    		top: 0,
    		position: "absolute"
  	},
  	iconLayout1: {
    		height: "100%",
    		width: "100%"
  	},
  	cursosTypo: {
		width: 160,
		color: Color.colorDarkslategray,
		fontFamily: "Poppins-SemiBold", // asegúrate de tener esta fuente cargada
		letterSpacing: 0.5,
		fontSize: 20, // tamaño según la imagen
		textAlign: "left",
		fontWeight: "600"
	},
  	verTypo: {
    		width: 80,
    		textAlign: "right",
    		fontFamily: FontFamily.robotoBold,
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		color: Color.colorDimgray,
    		fontWeight: "600"
  	},
  	categorasFlexBox: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: Gap.gap_12,
		width: '100%',
	},
  	recientesTypo: {
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
  	groupItemLayout: {
		height: 55, // antes: 48
		width: 165,
		position: "relative", // necesario para el centrado absoluto del texto
  	},
  	carousellLayout: {
    		maxWidth: 353,
    		width: 353,
    		flex: 1
  	},
  	iconLayout: {
		width: 203,
		height: 320, // antes: 300, ahora más alta
		top: 0,
		position: "absolute"
  	},
  	cursosPosition: {
    		left: 37,
    		position: "absolute"
  	},
  	recientes1Position: {
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
  	scrollChild: {
    		shadowRadius: 20,
    		elevation: 20,
    		height: 135, // antes: 124, ahora más grande
    		backgroundColor: "transparent",
    		shadowOpacity: 1,
    		shadowOffset: {
      			width: 0,
      			height: 6
    		},
    		shadowColor: Color.colorGray200,
    		borderRadius: Border.br_20,
    		width: 411
  	},
  	holaMara: {
    		fontSize: 30,
    		letterSpacing: 0.9,
    		fontFamily: FontFamily.montserratSemiBold,
    		color: Color.colorBlack,
    		height: 40,
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		fontWeight: "600",
    		lineHeight: 22,
    		marginTop: 50,
    		marginLeft: 27,
  	},
  	laCocinaTe: {
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
    		marginTop: 8,
    		marginLeft: 27,
  	},
  	searchBarChild: {
    		borderRadius: 10,
    		backgroundColor: Color.colorGainsboro200,
    		borderWidth: 1,
    		borderColor: Color.colorGray100,
    		borderStyle: "solid",
    		width: 358,
    		height: 45, // antes: 40
    		left: 0,
    		top: 0,
    		position: "absolute"
  	},
  	icon: {
    		maxWidth: "100%",
    		maxHeight: "100%",
    		nodeWidth: "5.14%",
    		nodeHeight: "44.5%",
    		overflow: "hidden"
  	},
  	lens: {
    		left: 16, // antes: "3.43%", ahora valor fijo para mejor centrado
    		top: "50%",
    		width: 24,
    		height: 24,
    		marginTop: -14, // la mitad de height negativo para centrar verticalmente
    		position: "absolute"
  	},
  	searchBarItem: {
    		left: 307,
    		borderRightWidth: 1,
    		width: 1,
    		height: 32, // antes: 28, ajusta para que ocupe más alto el buscador
    		top: "50%",
    		marginTop: -19, // la mitad de height negativo para centrar verticalmente (height/2)
    		borderColor: Color.colorGray100,
    		borderStyle: "solid",
    		position: "absolute"
  	},
  	icon1: {
    		marginTop: -12,
    		nodeWidth: 25,
    		nodeHeight: 24,
    		overflow: "hidden"
  	},
  	sliders: {
    		left: 315,
    		width: 24,
    		top: "50%",
    		height: 24,
    		marginTop: -15, // la mitad de height negativo para centrar verticalmente
    		position: "absolute"
  	},
  	buscar: {
    		left: 44,
    		color: Color.colorGray100,
    		width: 250, // más ancho para centrar visualmente el texto placeholder
    		height: 20, // ajusta la altura para mejor centrado vertical
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		top: "50%",
    		marginTop: -14, // ajusta para centrar verticalmente en el rectángulo más alto
    		fontFamily: FontFamily.interMedium,
    		fontWeight: "500",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		position: "absolute"
  	},
  	searchBar: {
    		width: 358,
    		height: 52, // antes: 40
    		alignSelf: "center",
    		marginTop: 24,
    		marginBottom: 16,
  	},
  	recetas: {
		marginLeft: 32,
		// Elimina marginTop
	},
  	verMs: {
		// Elimina marginTop, ya no se usa
	},
  	groupShadowBox: {
		backgroundColor: Color.colorGoldenrod,
		elevation: 12.3,
		shadowRadius: 12.3,
		height: 55, // antes: 48
		width: 165,
		borderRadius: 24, // antes: Border.br_20, ahora más redondeado
		shadowOpacity: 1,
		shadowOffset: {
			width: 0,
			height: 6
		},
		shadowColor: Color.colorGray200,
	},
  	recientes: {
    		color: Color.colorWhite
  	},
  	groupItem: {
		backgroundColor: Color.colorGainsboro100,
		borderRadius: 24, // antes: Border.br_20, ahora más redondeado
	},
  	populares: {
    		color: Color.colorDimgray
  	},
  	categorasRecetas: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 0, // antes: 16, ahora más arriba
		marginBottom: 16,
		gap: Gap.gap_12,
	},
  	carbonaraIcon: {
    		left: 0
  	},
  	carousellRecetas: {
    		marginTop: 4, // antes: 16, menos margen superior
    		marginLeft: 32,
  	},
  	carousellCursos: {
    		marginTop: 12, // antes: 32, menos margen superior
    		marginLeft: 32,
    		marginBottom: 32,
  	},
  	cursos: {
		marginLeft: 32,
	},
	rowHeader: {
		flexDirection: "row",
		alignItems: "center", // asegura alineación vertical
		width: "100%",
		marginTop: 32, // para Recetas, 48 para Cursos
		marginBottom: 0,
	},
	verMsCursos: {
		marginLeft: 'auto',
		marginRight: 32,
	},
  	verMs1: {
		// Elimina este estilo si ya no se usa
	},
  	recientes1: {
    		color: Color.colorWhite
  	},
  	ltimasVacantes: {
    		color: Color.colorDimgray
  	},
  	categorasCursos: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8, // antes: 16, ahora más arriba
		marginBottom: 16,
		gap: Gap.gap_12,
  	},
  	carouselRow: {
		flexDirection: "row",
	},
	carouselImage: {
		width: 203,
		height: 320, // antes: 300, ahora más alta
		borderRadius: 20,
		marginRight: 28,
		backgroundColor: "#eee",
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
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
});

export default Home;
