import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from './links/TabBar';

const MainLayout = ({ children, showTabBar = true, activeTab, onTabPress }) => {
  // If tab bar is shown, add extra bottom padding to content to avoid hiding content
  const extraPadding = showTabBar && typeof activeTab !== 'undefined' ? 64 : 0;
  return (
    <View style={styles.container}>
      <View style={[styles.content, extraPadding ? { paddingBottom: extraPadding } : null]}>{children}</View>
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
