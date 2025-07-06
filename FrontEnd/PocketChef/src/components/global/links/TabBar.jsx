import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired, getUserIdFromToken } from '../../../utils/jwt';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

const TABS = [
  {
    icon: 'home',
    selectedIcon: 'home',
    label: 'Inicio',
  },
  {
    icon: 'school',
    selectedIcon: 'school',
    label: 'Cursos',
  },
  {
    icon: 'add-circle-outline',
    selectedIcon: 'add-circle',
    label: 'Nueva',
  },
  {
    icon: 'bookmark-border',
    selectedIcon: 'bookmark',
    label: 'Favoritos',
  },
  {
    icon: 'person-outline',
    selectedIcon: 'person',
    label: 'Perfil',
  },
];

const TabBar = ({ activeTab }) => {
  const navigation = useNavigation();

  const [isOwnProfile, setIsOwnProfile] = React.useState(true);

  React.useEffect(() => {
    const checkOwnProfile = async () => {
      if (activeTab === 4) {
        const token = await AsyncStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          setIsOwnProfile(true);
          return;
        }
        const userId = getUserIdFromToken(token);
        // Get the current route's userId param
        const state = navigation.getState();
        const routes = state.routes || [];
        const currentRoute = routes[state.index] || {};
        const params = currentRoute.params || {};
        const profileUserId = params.userId || params.propUserId;
        setIsOwnProfile(!profileUserId || String(profileUserId) === String(userId));
      }
    };
    checkOwnProfile();
  }, [activeTab, navigation, navigation.getState()]);

  const handleTabPress = async (index) => {
    if (index === 0) navigation.replace('Home');
    else if (index === 4 || index === 3 || index === 2 || index === 1) {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) navigation.navigate('Login');
      else {
        if (index === 4 ) {
          const userId = getUserIdFromToken(token);
          navigation.replace('Profile', { userId });
        } else if (index === 3) {
          navigation.replace('BookMarkedRecipes');
        } else if (index === 2){
          navigation.navigate('CreateRecipe');
        } else if (index === 1) {
          navigation.replace('StudentCourses');
        }
      }
    }
    // Add more tab navigation as needed
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        let iconName = tab.icon;
        let iconColor = colors.mutedText;
        let iconType = 'outline';
        if (activeTab === index) {
          if (index === 4 && !isOwnProfile) {
            iconName = tab.icon;
            iconColor = colors.mutedText;
          } else {
            iconName = tab.selectedIcon;
            iconColor = colors.primary;
          }
        }
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <MaterialIcons name={iconName} size={35} color={iconColor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginBottom: 16,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 4,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default TabBar;
