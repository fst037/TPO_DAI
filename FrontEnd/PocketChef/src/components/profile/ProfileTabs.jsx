import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import colors from '../../theme/colors';

const windowWidth = Dimensions.get('window').width;

export default function ProfileTabs({ tabs }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={{ width: windowWidth }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        <View style={styles.tabs}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab.title}
              style={[
                styles.tab,
                selectedTab === idx && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab(idx)}
            >
              <Text style={[styles.tabText, selectedTab === idx && styles.selectedTabText]} numberOfLines={1} ellipsizeMode="tail">{tab.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.container, { width: windowWidth, alignSelf: 'center' }]}>
        {tabs[selectedTab]?.content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingHorizontal: 20 },
  tabsScroll: {
    paddingBottom: 0,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    height: 36,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.divider,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: 'transparent',
    marginRight: 0,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomWidth: 0,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  selectedTab: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    zIndex: 1,
  },
  tabText: {
    color: colors.mutedText,
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: colors.primary,
  },
  content: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  item: { fontSize: 16, marginVertical: 4 },
  empty: { color: colors.secondaryText, fontStyle: 'italic', marginTop: 16 },
});
