import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image, Pressable, ScrollView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {SafeAreaView} from "react-native-safe-area-context";
import TabBar from '../components/TabBar';
import { Border, Color, FontFamily, FontSize, Gap } from "../GlobalStyles";

const Home = () => {

	const [active, setActive] = useState(0);
	const [user, setUser] = useState(null);
	const [recipes, setRecipes] = useState([]);


	useEffect(() => {
    fetch('http://192.168.253.215:4002/recipes/')
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
        console.error('Error al hacer fetch:', error);
      });
  	}, []);
  	
  	return (
		<View style={styles.container}>
			<View style={styles.scrollPosition}>
					<View style={[styles.background, styles.scrollPosition]} />
					<LinearGradient style={[styles.scrollChild, styles.groupItemPosition]} locations={[0,1]} colors={['#e9ceaf','#edc45a']} useAngle={true} angle={-65.86} />
					<Text style={styles.holaMara}>{`Bienvenido!`}</Text>
					<Text style={styles.laCocinaTe}>La cocina te espera!</Text>

					{/*<Image style={styles.fotoDePerfil} resizeMode="cover" source={require("../assets/Foto de Perfil.png")} />*/}

					<View style={styles.searchBar}>
						<View style={styles.searchBarChild} />

						<Pressable style={styles.lens} onPress={()=>{}}>
								{/*<Image style={[styles.icon, styles.iconLayout1]} resizeMode="cover" source={require("../assets/Lens.png")} />*/}
						</Pressable>

						<View style={styles.searchBarItem} />

						<Pressable style={styles.sliders} onPress={()=>{}}>
								{/*<Image style={[styles.icon1, styles.iconLayout1]} resizeMode="cover" source={require("../assets/sliders.png")} />*/}
						</Pressable>

						<Text style={styles.buscar}>Buscar...</Text>
					</View>

					<Text style={[styles.recetas, styles.cursosTypo]}>{`Recetas `}</Text>
					<Text style={[styles.verMs, styles.verTypo]}>Ver más</Text>

					<View style={[styles.categorasRecetas, styles.categorasFlexBox]}>
						<View style={styles.groupItemLayout}>
								<View style={styles.groupShadowBox} />
								<Text style={[styles.recientes, styles.recientesTypo]}>Recientes</Text>
						</View>
						<View style={styles.groupItemLayout}>
								<View style={[styles.groupItem, styles.groupItemLayout]} />
								<Text style={[styles.populares, styles.recientesTypo]}>Populares</Text>
						</View>
					</View>

					<ScrollView style={[styles.carousellRecetas, styles.carousellLayout]}>
						<View style={styles.carousellRecetas1}>
							{recipes.length > 0 && (
								<Image
									source={{ uri: recipes[0].mainPhoto }}
									style={[styles.carbonaraIcon, styles.iconLayout]}
									resizeMode="cover"
								/>
								)}
								{/*
								<Pancakes style={[styles.pancakesIcon, styles.iconLayout]} width={203} height={300} />
								<Papasfritas style={[styles.papasFritasIcon, styles.iconLayout]} width={203} height={300} />*/}
						</View>
					</ScrollView>

					<Text style={[styles.cursos, styles.cursosPosition]}>Cursos</Text>
					<Pressable style={styles.verMs1} onPress={()=>{}}>
						<Text style={styles.verTypo}>Ver más</Text>
					</Pressable>

					<View style={[styles.categorasCursos, styles.categorasFlexBox]}>
						<View style={styles.groupItemLayout}>
								<View style={styles.groupShadowBox} />
								<Text style={[styles.recientes1, styles.recientes1Position]}>Recientes</Text>
						</View>
						<View style={styles.groupItemLayout}>
								<View style={[styles.groupItem, styles.groupItemLayout]} />
								<Text style={[styles.ltimasVacantes, styles.recientes1Position]}>¡Últimas Vacantes!</Text>
						</View>
					</View>

					<ScrollView style={[styles.carousellCursos, styles.cursosPosition]}>
						<View style={styles.carousellRecetas1}>
								<Pressable style={[styles.carbonaraIcon, styles.iconLayout]} onPress={()=>{}}>
									{/*<Image style={[styles.icon2, styles.iconLayout1]} resizeMode="cover" source={require("../assets/Vikingo.png")} />*/}
								</Pressable>

								{/*
								<Panificados style={[styles.pancakesIcon, styles.iconLayout]} width={203} height={300} />
								<Bebs style={[styles.papasFritasIcon, styles.iconLayout]} width={203} height={300} />*/}
						</View>
					</ScrollView>
			</View>
			<TabBar activeTab={active} onTabPress={setActive} />
		</View>
  	);
};


const styles = StyleSheet.create({
  	scrollPosition: {
    		width: 411,
    		top: 0,
    		left: 0,
    		position: "absolute",
    		height: 1200
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
    		fontFamily: FontFamily.poppinsSemiBold,
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		height: 28,
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		fontWeight: "600"
  	},
  	verTypo: {
    		width: 80,
    		textAlign: "right",
    		fontFamily: FontFamily.robotoBold,
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		height: 28,
    		color: Color.colorDimgray,
    		alignItems: "center",
    		display: "flex",
    		fontWeight: "600"
  	},
  	categorasFlexBox: {
    		gap: Gap.gap_12,
    		justifyContent: "center",
    		flexDirection: "row",
    		width: 358,
    		alignItems: "center",
    		position: "absolute"
  	},
  	recientesTypo: {
    		height: 26,
    		width: 138,
    		textAlign: "center",
    		letterSpacing: 0.4,
    		fontSize: FontSize.size_14,
    		left: "50%",
    		top: 11,
    		marginLeft: -68.5,
    		justifyContent: "center",
    		fontFamily: FontFamily.robotoBold,
    		alignItems: "center",
    		display: "flex",
    		fontWeight: "600",
    		position: "absolute"
  	},
  	groupItemLayout: {
    		height: 48,
    		width: 165
  	},
  	carousellLayout: {
    		maxWidth: 353,
    		width: 353,
    		flex: 1
  	},
  	iconLayout: {
    		width: 203,
    		height: 300,
    		top: 0,
    		position: "absolute"
  	},
  	cursosPosition: {
    		left: 37,
    		position: "absolute"
  	},
  	recientes1Position: {
    		width: 136,
    		marginLeft: -67.5,
    		height: 26,
    		textAlign: "center",
    		letterSpacing: 0.4,
    		fontSize: FontSize.size_14,
    		left: "50%",
    		top: 11,
    		justifyContent: "center",
    		fontFamily: FontFamily.robotoBold,
    		alignItems: "center",
    		display: "flex",
    		fontWeight: "600",
    		position: "absolute"
  	},
  	background: {
    		backgroundColor: Color.colorWhite
  	},
  	scrollChild: {
    		shadowRadius: 20,
    		elevation: 20,
    		height: 124,
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
    		left: 27,
    		top: 50,
    		position: "absolute"
  	},
  	laCocinaTe: {
    		top: 88,
    		fontSize: 20,
    		letterSpacing: 0.6,
    		// width: 207, // Elimina el ancho fijo para que se alinee con el texto de arriba
    		height: 24,
    		fontFamily: FontFamily.interMedium,
    		fontWeight: "500",
    		color: Color.colorDimgray,
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		lineHeight: 13,
    		left: 27, // Igual que holaMara para alinear horizontalmente
    		position: "absolute"
  	},
  	fotoDePerfil: {
    		left: 331,
    		width: 54,
    		height: 54,
    		top: 26,
    		position: "absolute"
  	},
  	searchBarChild: {
    		borderRadius: 10,
    		backgroundColor: Color.colorGainsboro200,
    		borderWidth: 1,
    		borderColor: Color.colorGray100,
    		borderStyle: "solid",
    		width: 358,
    		height: 40,
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
    		left: "3.43%",
    		top: "27.5%",
    		right: "91.43%",
    		bottom: "28%",
    		width: "5.14%",
    		height: "44.5%",
    		position: "absolute"
  	},
  	searchBarItem: {
    		marginTop: -13,
    		left: 307,
    		borderRightWidth: 1,
    		width: 1,
    		height: 28,
    		top: "50%",
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
    		width: 25,
    		top: "50%",
    		height: 24,
    		position: "absolute"
  	},
  	buscar: {
    		marginTop: -8,
    		left: 44,
    		color: Color.colorGray100,
    		width: 121,
    		height: 16,
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		top: "50%",
    		fontFamily: FontFamily.interMedium,
    		fontWeight: "500",
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		position: "absolute"
  	},
  	searchBar: {
    		top: 146,
    		width: 358,
    		height: 40,
    		left: 27,
    		position: "absolute"
  	},
  	recetas: {
    		left: 32,
    		top: 212,
    		position: "absolute"
  	},
  	verMs: {
    		left: 305,
    		top: 212,
    		position: "absolute"
  	},
  	groupShadowBox: {
    		backgroundColor: Color.colorGoldenrod,
    		elevation: 12.3,
    		shadowRadius: 12.3,
    		height: 48,
    		width: 165,
    		borderRadius: Border.br_20,
    		shadowOpacity: 1,
    		shadowOffset: {
      			width: 0,
      			height: 6
    		},
    		shadowColor: Color.colorGray200,
    		left: 0,
    		top: 0,
    		position: "absolute"
  	},
  	recientes: {
    		color: Color.colorWhite
  	},
  	groupItem: {
    		backgroundColor: Color.colorGainsboro100,
    		borderRadius: Border.br_20,
    		left: 0,
    		top: 0,
    		position: "absolute"
  	},
  	populares: {
    		color: Color.colorDimgray
  	},
  	categorasRecetas: {
    		top: 255,
    		left: 27,
    		justifyContent: "center",
    		flexDirection: "row"
  	},
  	carbonaraIcon: {
    		left: 0
  	},
  	pancakesIcon: {
    		left: 231
  	},
  	papasFritasIcon: {
    		left: 462
  	},
  	carousellRecetas1: {
    		width: 665,
    		height: 300,
    		left: 0,
    		top: 0,
    		position: "absolute"
  	},
  	carousellRecetas: {
    		top: 328,
    		left: 32,
    		position: "absolute"
  	},
  	cursos: {
    		top: 675,
    		width: 160,
    		color: Color.colorDarkslategray,
    		fontFamily: FontFamily.poppinsSemiBold,
    		letterSpacing: 0.5,
    		fontSize: FontSize.size_16,
    		height: 28,
    		alignItems: "center",
    		display: "flex",
    		textAlign: "left",
    		fontWeight: "600"
  	},
  	verMs1: {
    		left: 310,
    		top: 675,
    		position: "absolute"
  	},
  	recientes1: {
    		color: Color.colorWhite
  	},
  	ltimasVacantes: {
    		color: Color.colorDimgray
  	},
  	categorasCursos: {
    		top: 718,
    		left: 32
  	},
  	icon2: {
    		nodeWidth: 203,
    		nodeHeight: 300
  	},
  	carousellCursos: {
    		top: 791,
    		maxWidth: 353,
    		width: 353,
    		flex: 1
  	},
  	home: {
    		borderRadius: 28,
    		overflow: "hidden",
    		height: 1200,
    		width: "100%",
    		flex: 1
  	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});

export default Home;
