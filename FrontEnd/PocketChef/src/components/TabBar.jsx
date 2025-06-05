import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import HomeIcon from '../../assets/Icons/home.svg';
import HomeSelectedIcon from '../../assets/Icons/home_selected.svg';
import CoursesIcon from '../../assets/Icons/courses.svg';
import CoursesSelectedIcon from '../../assets/Icons/courses_selected.svg';
import LikeIcon from '../../assets/Icons/like.svg';
import LikeSelectedIcon from '../../assets/Icons/like_selected.svg';
import NewIcon from '../../assets/Icons/new.svg';
import UserIcon from '../../assets/Icons/user.svg';
import UserSelectedIcon from '../../assets/Icons/user_selected.svg';

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



const TabBar = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab, index) => {
        const IconComponent = activeTab === index ? tab.selectedIcon : tab.icon;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => onTabPress(index)}
          >
            <IconComponent width={35} height={35} />
            <Text style={[styles.label, activeTab === index && styles.activeLabel]}>
              {tab.label}
            </Text>
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeLabel: {
    color: '#ED802A',
    fontWeight: '600',
  },
});

export default TabBar;
