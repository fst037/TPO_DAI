import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from './TabBar';

const MainLayout = ({ children, showTabBar = true, activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {showTabBar && <TabBar activeTab={activeTab} onTabPress={onTabPress} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;
