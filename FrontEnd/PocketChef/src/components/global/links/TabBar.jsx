import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenExpired, getUserIdFromToken } from '../../../utils/jwt';
import HomeIcon from '../../../../assets/Icons/home.svg';
import HomeSelectedIcon from '../../../../assets/Icons/home_selected.svg';
import CoursesIcon from '../../../../assets/Icons/courses.svg';
import CoursesSelectedIcon from '../../../../assets/Icons/courses_selected.svg';
import LikeIcon from '../../../../assets/Icons/like.svg';
import LikeSelectedIcon from '../../../../assets/Icons/like_selected.svg';
import NewIcon from '../../../../assets/Icons/new.svg';
import UserIcon from '../../../../assets/Icons/user.svg';
import UserSelectedIcon from '../../../../assets/Icons/user_selected.svg';
import colors from '../../../theme/colors';

const TABS = [
  {
    icon: HomeIcon,
    selectedIcon: HomeSelectedIcon,
  },
  {
    icon: CoursesIcon,
    selectedIcon: CoursesSelectedIcon,
  },
  {
    icon: NewIcon,
    selectedIcon: NewIcon, 
  },
  {
    icon: LikeIcon,
    selectedIcon: LikeSelectedIcon,
  },
  {
    icon: UserIcon,
    selectedIcon: UserSelectedIcon,
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
    if (index === 0) navigation.navigate('Home');
    else if (index === 2) navigation.navigate('CreateRecipe');
    else if (index === 4) {
      const token = await AsyncStorage.getItem('token');
      if (!token || isTokenExpired(token)) navigation.navigate('Login');
      else {
        const userId = getUserIdFromToken(token);
        navigation.navigate('Profile', { userId });
      }
    }
    // Add more tab navigation as needed
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        let IconComponent = tab.icon;
        if (activeTab === index) {
          if (index === 4 && !isOwnProfile) {
            IconComponent = tab.icon; // Not colored for other users
          } else {
            IconComponent = tab.selectedIcon;
          }
        }
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(index)}
          >
            <IconComponent width={35} height={35} />
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
