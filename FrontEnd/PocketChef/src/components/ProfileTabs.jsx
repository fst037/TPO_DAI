import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function ProfileTabs({ tabNames, children }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        <View style={styles.tabs}>
          {tabNames.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === idx && styles.selectedTab,
                idx !== tabNames.length - 1 && styles.tabDivider,
              ]}
              onPress={() => setSelectedTab(idx)}
            >
              <Text style={[styles.tabText, selectedTab === idx && styles.selectedTabText]} numberOfLines={1} ellipsizeMode="tail">{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.container, { width: windowWidth, alignSelf: 'center' }]}>{children[selectedTab]}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', padding: 20 },
  tabsScroll: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: windowWidth,
    paddingBottom: 0,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
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
  },
  tabDivider: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0', // subtle grey line
  },
  selectedTab: {
    backgroundColor: '#fff',
    borderColor: '#FFA726',
    borderBottomWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 2,
    borderTopColor: '#FFA726',
    zIndex: 1,
  },
  tabText: {
    color: '#888',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: '#FFA726',
  },
  content: {
    minHeight: 80,
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // subtle grey line at the end
  },
  item: { fontSize: 16, marginVertical: 4 },
  empty: { color: '#aaa', fontStyle: 'italic', marginTop: 16 },
});
