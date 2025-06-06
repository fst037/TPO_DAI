import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function ProfileTabs({ tabs }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={{ width: windowWidth, paddingTop: 16 }}>
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
    borderWidth: 1,
    borderColor: '#e0e0e0', // subtle grey line
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // subtle grey line at the end
  },
  item: { fontSize: 16, marginVertical: 4 },
  empty: { color: '#aaa', fontStyle: 'italic', marginTop: 16 },
});
